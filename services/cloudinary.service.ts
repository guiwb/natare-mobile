import { http } from '@/lib/http/axios';

interface PresignedUrlResponse {
  signature: string;
  timestamp: number;
  api_key: string;
  upload_url: string;
  public_id: string;
  folder: string;
}

export default class CloudinaryService {
  private static async getPresignedUrl(
    folder: string,
  ): Promise<PresignedUrlResponse> {
    const { data } = await http.post('/api/asset_presigned_url', { folder });
    return data;
  }

  static async uploadImage(localUri: string, folder: string): Promise<string> {
    const { signature, timestamp, api_key, upload_url, public_id } =
      await this.getPresignedUrl(folder);

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    formData.append('api_key', api_key);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('public_id', public_id);
    formData.append('folder', folder);

    const response = await fetch(upload_url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Falha no upload da imagem');

    const data = await response.json();
    return data.secure_url as string;
  }
}
