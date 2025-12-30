import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Camera, CheckCircle2 } from "lucide-react";

const MobileUploadPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size cannot exceed 10MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 读取文件为base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        try {
          // 通过Vite代理上传（使用相对路径，由Vite代理到后端服务器）
          const apiUrl = `/api/upload/${sessionId}`;
          
          // 通过API上传图片数据
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageData: base64Data,
              fileName: file.name,
              fileSize: file.size,
              mimeType: file.type,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', response.status, errorText);
            throw new Error(`Upload failed: ${response.status}`);
          }

          const result = await response.json();
          console.log('Upload successful:', result);
          setUploading(false);
          setUploaded(true);

          // 3秒后提示可以关闭页面
          setTimeout(() => {
            setUploaded(false);
          }, 3000);
        } catch (uploadError) {
          console.error('Upload error:', uploadError);
          setError('Upload failed, please check network connection');
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read file, please try again');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Upload failed, please try again');
      setUploading(false);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card grid-line p-8 rounded-lg">
          <h1 className="text-display-lg font-display text-[hsl(var(--aurora-cyan))] mb-6 text-center">
            Upload Image
          </h1>

          {uploaded ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-20 h-20 text-[hsl(var(--aurora-cyan))] mx-auto mb-4" />
              <p className="text-label text-foreground/80 mb-2">Upload Successful!</p>
              <p className="text-meta text-foreground/50">Image sent to computer</p>
              <p className="text-meta text-foreground/40 mt-4">You can close this page</p>
            </div>
          ) : (
            <>
              <p className="text-label text-foreground/60 text-center mb-8">
                Please select a mushroom image to identify
              </p>

              <div className="space-y-4">
                {/* Camera Button */}
                <button
                  onClick={handleCameraClick}
                  disabled={uploading}
                  className="w-full py-4 px-6 bg-[hsl(var(--aurora-cyan))]/20 border-2 border-[hsl(var(--aurora-cyan))]/50 hover:border-[hsl(var(--aurora-cyan))] rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Camera className="w-6 h-6 text-[hsl(var(--aurora-cyan))]" />
                  <span className="text-label text-foreground">Take Photo</span>
                </button>

                {/* Select from Gallery Button */}
                <button
                  onClick={handleFileClick}
                  disabled={uploading}
                  className="w-full py-4 px-6 bg-background/50 border-2 border-foreground/20 hover:border-foreground/40 rounded-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-6 h-6 text-foreground/60" />
                  <span className="text-label text-foreground/80">Select from Gallery</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploading && (
                <div className="mt-8 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[hsl(var(--aurora-cyan))]/30 border-t-[hsl(var(--aurora-cyan))]"></div>
                  <p className="mt-4 text-label text-foreground/50">Uploading...</p>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <p className="text-label text-destructive text-center">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        <p className="text-meta text-foreground/30 text-center mt-6">
          After scanning QR code, upload image here
        </p>
      </div>
    </div>
  );
};

export default MobileUploadPage;

