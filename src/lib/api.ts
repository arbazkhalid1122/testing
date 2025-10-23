import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// API Response types
interface Order {
  id: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postCard: any;
}

interface PostCard {
  id: string;
  message: string;
  address: string;
}

interface UpdateRequest {
  expired: boolean;
  order: Order;
}

interface StripeClientResponse {
  client_secret: string;
}

interface SignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

// Singleton API class
class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_ENDPOINT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (config: any) => {
        console.log("API Request:", config.method?.toUpperCase(), config.url);
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        console.error(
          "API Error:",
          error.response?.status,
          error.response?.data,
        );
        return Promise.reject(error);
      },
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Environment variable getters
  getStripePublishableKey(): string {
    return process.env.NEXT_PUBLIC_STRIPE_PK || "";
  }

  getS3Endpoint(): string {
    return process.env.NEXT_PUBLIC_S3_ENDPOINT || "";
  }

  getBackendEndpoint(): string {
    return process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || "";
  }

  // Image URL generation methods
  getPreviewImageUrl(previewFrontUrl: string): string {
    return `${this.getBackendEndpoint()}/${previewFrontUrl}`;
  }

  getBackImageUrl(postCardId: string): string {
    return `${this.getS3Endpoint()}/postCards/${postCardId}/back.jpg`;
  }

  getFrontImageUrl(postCardId: string, fileExtension: string): string {
    return `${this.getS3Endpoint()}/postCards/${postCardId}/front.${fileExtension}`;
  }

  getOrderImageUrl(orderId: number): string {
    return `${this.getS3Endpoint()}/orders/${orderId}`;
  }

  // Orders API methods
  async getOrderByToken(token: string): Promise<UpdateRequest> {
    const response = await this.axiosInstance.get(
      `/orders/order-by-token?token=${token}`,
    );
    return response.data;
  }

  async deleteUpdateOrderRequest(token: string): Promise<void> {
    await this.axiosInstance.delete(
      `/orders/delete-update-order-request?token=${token}`,
    );
  }

  async createOrder(
    paymentIntent: string,
    postCardId: string,
    customerEmail: string,
    customerPhone: string,
  ): Promise<Order> {
    const response = await this.axiosInstance.post(
      `/orders?paymentIntent=${paymentIntent}`,
      {
        postCardId,
        customerEmail,
        customerPhone,
      },
    );
    return response.data;
  }

  async createStripeClient(
    amount: number,
    email: string,
  ): Promise<StripeClientResponse> {
    const response = await this.axiosInstance.post("/orders/stripe-client", {
      amount,
      email,
    });
    return response.data;
  }

  // PostCards API methods
  async getPostCard(postCardId: string): Promise<PostCard> {
    const response = await this.axiosInstance.get(`/post-cards/${postCardId}`);
    return response.data;
  }

  async createPostCard(message: string, address: string): Promise<PostCard> {
    const response = await this.axiosInstance.post("/post-cards/", {
      message,
      address: JSON.stringify(address),
    });
    return response.data;
  }

  async updatePostCard(
    postCardId: string,
    message: string,
    address: string,
  ): Promise<void> {
    await this.axiosInstance.patch(`/post-cards/${postCardId}`, {
      message,
      address: JSON.stringify(address),
    });
  }

  async updatePostCardWithFilePath(
    postCardId: string,
    filePath: string,
  ): Promise<void> {
    await this.axiosInstance.patch(`/post-cards/${postCardId}`, {
      filePath,
    });
  }

  async uploadPostCardImages(
    postCardId: string,
    previewPath: string,
  ): Promise<void> {
    await this.axiosInstance.post(
      `/post-cards/${postCardId}/upload-images?previewPath=${previewPath}`,
      {
        image: "",
      },
    );
  }

  async getSignedUrl(
    postCardId: string,
    fileExt: string,
  ): Promise<SignedUrlResponse> {
    const response = await this.axiosInstance.get(
      `/post-cards/${postCardId}/get-signed-url?ext=${fileExt}`,
    );
    return response.data;
  }

  async updatePostCardFromUrl(
    postCardId: string,
    filePath: string,
  ): Promise<void> {
    await this.axiosInstance.patch(
      `/post-cards/${postCardId}?isUpdatingFromUrl=true`,
      {
        filePath,
      },
    );
  }

  async uploadBackImage(postCardId: string): Promise<void> {
    await this.axiosInstance.post(
      `/post-cards/${postCardId}/upload-back-image?isUpdatingFromUrl=true`,
      {
        image: "",
      },
    );
  }

  // Direct axios method for external URLs (like S3 uploads)
  async uploadToExternalUrl(
    uploadUrl: string,
    file: File,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return axios.put(uploadUrl, file, options);
  }
}

// Export singleton instance
const api = ApiService.getInstance();

export default api;
