import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, QrCode } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { volcanoClient } from "../../integrations/volcano/client";

interface ScanModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ScanModal = ({ isOpen, onClose }: ScanModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mushroomResult, setMushroomResult] = useState<{
        primaryMushroom?: string;
        similarMushrooms?: string[];
    } | null>(null);
    const [showQRCode, setShowQRCode] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [localIP, setLocalIP] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    
    // 生成唯一session ID
    const generateSessionId = () => {
        return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // 打开二维码
    const handleOpenQRCode = () => {
        // 清理之前的轮询
        stopPolling();
        const newSessionId = generateSessionId();
        console.log('Opening QR code with session ID:', newSessionId);
        setSessionId(newSessionId);
        setShowQRCode(true);
        startPolling(newSessionId);
    };

    // 关闭二维码
    const handleCloseQRCode = () => {
        setShowQRCode(false);
        stopPolling();
    };

    // 开始轮询检查上传的图片
    const startPolling = (id: string) => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }

        const startTime = Date.now();
        const timeout = 300000; // 5分钟超时

        pollingIntervalRef.current = setInterval(async () => {
            // 检查超时
            if (Date.now() - startTime > timeout) {
                stopPolling();
                setShowQRCode(false);
                return;
            }

            try {
                // 获取API服务器地址（通过Vite代理）
                const apiUrl = `/api/upload/${id}`;
                
                // 通过API获取上传的图片
                const response = await fetch(apiUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Polling received data:', { sessionId: data.sessionId, hasImageData: !!data.imageData });
                    if (data.imageData && data.sessionId === id) {
                        console.log('Image received, stopping polling');
                        // 找到上传的图片，停止轮询
                        stopPolling();
                        // 删除服务器上的数据
                        try {
                            await fetch(apiUrl, { method: 'DELETE' });
                        } catch (err) {
                            console.error('Error deleting upload:', err);
                        }
                        // 关闭二维码
                        setShowQRCode(false);
                        // 处理图片
                        handleImageFromMobile(data.imageData);
                    }
                } else if (response.status !== 404) {
                    // 404是正常的（还没有上传），其他错误需要记录
                    console.warn('Polling received non-404 error:', response.status, response.statusText);
                }
            } catch (err) {
                // 网络错误，继续轮询
                console.error('Polling error:', err);
            }
        }, 1000); // 每秒检查一次
    };

    // 停止轮询
    const stopPolling = () => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
    };

    // 处理从手机上传的图片
    const handleImageFromMobile = async (base64Data: string) => {
        try {
            // 将base64转换为File对象
            const response = await fetch(base64Data);
            const blob = await response.blob();
            const file = new File([blob], `mobile_upload_${Date.now()}.jpg`, { type: blob.type });

            // 设置预览
            setImagePreview(base64Data);
            setSelectedFile(file);
            setError(null);
            setMushroomResult(null);
            setImageDimensions(null);
            setLoading(true);

            // 处理图片识别
            try {
                console.log('=== Starting Mushroom Identification Process (Mobile Upload) ===');
                
                const result = await volcanoClient.processMushroomImage(file);
                
                if (result.success) {
                    console.log('=== API Response Successful ===');
                    console.log('Primary mushroom:', result.primaryMushroom);
                    console.log('Similar mushrooms:', result.similarMushrooms);
                    
                    setMushroomResult({
                        primaryMushroom: result.primaryMushroom,
                        similarMushrooms: result.similarMushrooms
                    });
                } else {
                    console.error('=== API Response Failed ===');
                    let errorMessage = result.error || 'Failed to process mushroom image';
                    if (result.details) {
                        errorMessage += ' (Check browser console for details)';
                    }
                    setError(errorMessage);
                }
            } catch (err) {
                console.error('=== API Call Exception ===');
                setError(err instanceof Error ? err.message + ' (Check browser console for details)' : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        } catch (err) {
            console.error('Error processing mobile upload:', err);
                setError('Error processing mobile upload');
            setLoading(false);
        }
    };

    // 检查是否是局域网IP
    const isLocalNetworkIP = (ip: string): boolean => {
        return /^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(ip);
    };

    // 获取局域网IP地址
    useEffect(() => {
        const getLocalIP = async () => {
            const hostname = window.location.hostname;
            
            // 如果当前hostname是局域网IP，直接使用
            if (isLocalNetworkIP(hostname)) {
                setLocalIP(hostname);
                return;
            }

            // 如果是localhost，尝试通过WebRTC获取本地IP
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                try {
                    const pc = new RTCPeerConnection({
                        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                    });
                    
                    pc.createDataChannel('');
                    
                    pc.onicecandidate = (event) => {
                        if (event.candidate) {
                            const candidate = event.candidate.candidate;
                            const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
                            if (ipMatch && ipMatch[1]) {
                                const ip = ipMatch[1];
                                // 只接受局域网IP地址
                                if (isLocalNetworkIP(ip)) {
                                    setLocalIP(ip);
                                    pc.close();
                                }
                            }
                        }
                    };
                    
                    pc.createOffer().then(offer => pc.setLocalDescription(offer));
                    
                    // 3秒超时
                    setTimeout(() => {
                        pc.close();
                    }, 3000);
                } catch (err) {
                    console.error('Failed to get local IP:', err);
                }
            }
        };

        if (showQRCode) {
            getLocalIP();
        }
    }, [showQRCode]);

    // 组件卸载时清理轮询
    useEffect(() => {
        return () => {
            stopPolling();
        };
    }, []);

    // 当弹窗关闭时清理轮询
    useEffect(() => {
        if (!isOpen) {
            stopPolling();
            setShowQRCode(false);
        }
    }, [isOpen]);

    // 获取二维码URL
    const getQRCodeURL = (): string | null => {
        if (!sessionId) return null;
        
        const hostname = window.location.hostname;
        const port = window.location.port || '5173';
        
        // 如果获取到了本地IP且是局域网IP，使用IP
        if (localIP && isLocalNetworkIP(localIP)) {
            return `http://${localIP}:${port}/upload/${sessionId}`;
        }
        
        // 如果当前不是localhost且是局域网IP，直接使用hostname
        if (hostname !== 'localhost' && hostname !== '127.0.0.1' && isLocalNetworkIP(hostname)) {
            return `http://${hostname}:${port}/upload/${sessionId}`;
        }
        
        // 如果是localhost或非局域网IP，返回null表示需要提示用户
        return null;
    };

    const handleFileInputClick = () => {
        fileInputRef.current?.click();
    };
    
    // 处理图片加载，获取真实尺寸
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setImageDimensions({ 
                width: img.naturalWidth, 
                height: img.naturalHeight 
            });
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
            setMushroomResult(null);
            setImageDimensions(null);
            setLoading(true);
            
            // Create image preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            
            try {
                // Call Volcano Engine API for mushroom identification
                console.log('=== Starting Mushroom Identification Process ===');
                console.log('Uploading file to API:', file.name, file.size, file.type);
                
                const result = await volcanoClient.processMushroomImage(file);
                
                if (result.success) {
                    console.log('=== API Response Successful ===');
                    console.log('Primary mushroom:', result.primaryMushroom);
                    console.log('Similar mushrooms:', result.similarMushrooms);
                    
                    setMushroomResult({
                        primaryMushroom: result.primaryMushroom,
                        similarMushrooms: result.similarMushrooms
                    });
                } else {
                    console.error('=== API Response Failed ===');
                    console.error('Error:', result.error);
                    console.error('Details:', result.details);
                    
                    // Display more detailed error information
                    let errorMessage = result.error || 'Failed to process mushroom image';
                    if (result.details) {
                        errorMessage += ' (Check browser console for details)';
                    }
                    
                    setError(errorMessage);
                }
            } catch (err) {
                console.error('=== API Call Exception ===');
                console.error('Error:', err);
                
                setError(err instanceof Error ? err.message + ' (Check browser console for details)' : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }
    };
    
    const handleRemoveImage = () => {
        setSelectedFile(null);
        setImagePreview(null);
        setImageDimensions(null);
        setLoading(false);
        setError(null);
        setMushroomResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // 计算图片显示尺寸（自适应，但限制最大尺寸）
    const getImageDisplaySize = () => {
        if (!imageDimensions) return { width: 192, height: 192 };
        
        const maxWidth = 400;
        const maxHeight = 400;
        const aspectRatio = imageDimensions.width / imageDimensions.height;
        
        let width = imageDimensions.width;
        let height = imageDimensions.height;
        
        if (width > maxWidth) {
            width = maxWidth;
            height = width / aspectRatio;
        }
        
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        return { width, height };
    };

    const imageDisplaySize = getImageDisplaySize();

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-card grid-line w-full max-w-2xl pointer-events-auto relative shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 text-foreground/40 hover:text-foreground transition-colors"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* QR Code Button - 右下角 */}
                            <button
                                onClick={handleOpenQRCode}
                                className="absolute bottom-4 right-4 z-10 p-3 bg-[hsl(var(--aurora-cyan))]/20 border border-[hsl(var(--aurora-cyan))]/30 hover:border-[hsl(var(--aurora-cyan))] hover:bg-[hsl(var(--aurora-cyan))]/30 transition-all rounded-lg"
                                aria-label="Scan QR Code"
                            >
                                <QrCode className="w-5 h-5 text-[hsl(var(--aurora-cyan))]" />
                            </button>

                            {/* Header */}
                            <div className="px-8 pt-8 pb-6 grid-line-b">
                                <h2 className="text-display-lg font-display text-[hsl(var(--aurora-cyan))]">
                                    SCAN SPECIES
                                </h2>
                            </div>

                            {/* Content Section - 自适应高度 */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-8 flex flex-col items-center">
                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    
                                    {/* Upload Area or Image Preview */}
                                    {!selectedFile ? (
                                        <>
                                            <button 
                                                onClick={handleFileInputClick}
                                                className="group relative p-12 rounded-full bg-background/50 border-2 border-[hsl(var(--aurora-cyan))]/30 hover:border-[hsl(var(--aurora-cyan))] transition-all duration-300 mb-6 hover:bg-background/70"
                                            >
                                                <Camera className="w-16 h-16 text-[hsl(var(--aurora-cyan))] transition-transform group-hover:scale-110" />
                                            </button>
                                            <p className="text-label text-foreground/50 text-center mb-2">
                                                Click to upload mushroom photo
                                            </p>
                                            <p className="text-meta text-foreground/30 text-center">
                                                Supported formats: JPG, PNG, WEBP
                                            </p>
                                        </>
                                    ) : (
                                        <div className="w-full flex flex-col items-center">
                                            <div className="relative mb-6 group">
                                                <img 
                                                    ref={imageRef}
                                                    src={imagePreview || ''} 
                                                    alt="Selected mushroom" 
                                                    onLoad={handleImageLoad}
                                                    style={{
                                                        width: imageDimensions ? `${imageDisplaySize.width}px` : 'auto',
                                                        height: imageDimensions ? `${imageDisplaySize.height}px` : 'auto',
                                                        maxWidth: '100%',
                                                        maxHeight: '400px',
                                                    }}
                                                    className="object-contain rounded-lg border-2 border-[hsl(var(--aurora-cyan))]/30 bg-background/20 p-2"
                                                />
                                                <button
                                                    onClick={handleRemoveImage}
                                                    className="absolute -top-3 -right-3 bg-card/95 backdrop-blur-sm rounded-full p-2 border border-[hsl(var(--aurora-cyan))]/30 hover:border-[hsl(var(--aurora-cyan))] transition-all hover:bg-card"
                                                >
                                                    <X className="w-4 h-4 text-[hsl(var(--aurora-cyan))]" />
                                                </button>
                                            </div>
                                            {!loading && !error && !mushroomResult && (
                                                <p className="text-label text-foreground/50 text-center mb-2">
                                                    Click the icon to change photo
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Loading State */}
                                    {loading && (
                                        <div className="mt-8 text-center w-full">
                                            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[hsl(var(--aurora-cyan))]/30 border-t-[hsl(var(--aurora-cyan))] mb-4"></div>
                                            <p className="text-label text-foreground/50">Identifying mushroom...</p>
                                            <p className="text-meta text-foreground/30 mt-2">Please wait</p>
                                        </div>
                                    )}
                                    
                                    {/* Error State */}
                                    {error && (
                                        <div className="mt-8 text-center w-full max-w-md">
                                            <div className="px-6 py-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                                                <p className="text-label text-destructive">{error}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Mushroom Identification Results */}
                                    {mushroomResult && !loading && !error && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="mt-8 w-full max-w-md space-y-6"
                                        >
                                            {mushroomResult.primaryMushroom && (
                                                <div className="grid-line-b pb-6">
                                                    <p className="text-meta text-foreground/50 mb-3 uppercase tracking-wider">
                                                        Primary Identification
                                                    </p>
                                                    <h3 className="text-display-lg font-display text-[hsl(var(--aurora-cyan))] break-words">
                                                        {mushroomResult.primaryMushroom}
                                                    </h3>
                                                </div>
                                            )}
                                            
                                            {mushroomResult.similarMushrooms && mushroomResult.similarMushrooms.length > 0 && (
                                                <div>
                                                    <p className="text-meta text-foreground/50 mb-4 uppercase tracking-wider">
                                                        Similar Species
                                                    </p>
                                                    <div className="flex flex-wrap gap-3 justify-center">
                                                        {mushroomResult.similarMushrooms.map((mushroom, index) => (
                                                            <motion.span
                                                                key={index}
                                                                initial={{ opacity: 0, scale: 0.9 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="px-4 py-2 bg-background/50 border border-[hsl(var(--aurora-cyan))]/30 rounded-full text-label text-foreground/80 hover:border-[hsl(var(--aurora-cyan))] hover:bg-background/70 transition-all"
                                                            >
                                                                {mushroom}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* QR Code Modal */}
                    <AnimatePresence>
                        {showQRCode && sessionId && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={handleCloseQRCode}
                                    className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[101]"
                                />

                                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-card grid-line pointer-events-auto relative shadow-2xl p-8 rounded-lg"
                                    >
                                        <button
                                            onClick={handleCloseQRCode}
                                            className="absolute top-4 right-4 p-2 text-foreground/40 hover:text-foreground transition-colors"
                                            aria-label="Close QR Code"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="flex flex-col items-center">
                                            <h3 className="text-display-md font-display text-[hsl(var(--aurora-cyan))] mb-4">
                                                Scan to Upload
                                            </h3>
                                            <p className="text-label text-foreground/50 mb-6 text-center">
                                                Scan QR code with your phone<br />to upload from photo library
                                            </p>

                                            {getQRCodeURL() ? (
                                                <>
                                                    <div className="p-6 bg-white rounded-lg mb-4 shadow-lg">
                                                        <QRCodeSVG
                                                            value={getQRCodeURL()!}
                                                            size={320}
                                                            level="H"
                                                            includeMargin={true}
                                                            fgColor="#000000"
                                                            bgColor="#FFFFFF"
                                                        />
                                                    </div>
                                                    <p className="text-meta text-foreground/50 text-center mb-2 break-all px-4">
                                                        {getQRCodeURL()}
                                                    </p>
                                                    <div className="mt-4 p-3 bg-background/30 rounded border border-[hsl(var(--aurora-cyan))]/20">
                                                        <p className="text-meta text-foreground/60 text-center mb-2">
                                                            💡 Tips:
                                                        </p>
                                                        <ul className="text-meta text-foreground/50 text-left space-y-1 text-xs">
                                                            <li>• Ensure phone and computer are on the same WiFi network</li>
                                                            <li>• If unable to access, check firewall settings</li>
                                                            <li>• IP address should be in 192.168.x.x format</li>
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="p-6 bg-destructive/10 border border-destructive/30 rounded-lg mb-4 max-w-sm">
                                                    <p className="text-label text-destructive text-center mb-4">
                                                        Unable to Generate QR Code
                                                    </p>
                                                    <p className="text-meta text-foreground/60 text-center mb-4">
                                                        Please access this page using your local network IP:
                                                    </p>
                                                    <div className="bg-background/50 p-4 rounded mb-4">
                                                        <p className="text-label text-[hsl(var(--aurora-cyan))] text-center mb-2">
                                                            How to Get Your Local Network IP?
                                                        </p>
                                                        <ul className="text-meta text-foreground/60 text-left space-y-2 text-xs">
                                                            <li><strong>Windows:</strong> Open Command Prompt, type <code className="bg-background/70 px-1 rounded">ipconfig</code>, find "IPv4 Address"</li>
                                                            <li><strong>Mac:</strong> System Preferences → Network → View IP Address</li>
                                                            <li><strong>Linux:</strong> Terminal, type <code className="bg-background/70 px-1 rounded">ip addr</code> or <code className="bg-background/70 px-1 rounded">ifconfig</code></li>
                                                        </ul>
                                                    </div>
                                                    <p className="text-meta text-foreground/50 text-center mb-2">
                                                        Then access using this format:
                                                    </p>
                                                    <p className="text-label text-foreground/80 text-center bg-background/50 p-2 rounded">
                                                        http://YOUR_IP:5173
                                                    </p>
                                                    <p className="text-meta text-foreground/40 text-center mt-4">
                                                        Current access: {window.location.origin}
                                                    </p>
                                                </div>
                                            )}

                                            <p className="text-meta text-foreground/40 text-center mt-4">
                                                Waiting for mobile upload...
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ScanModal;