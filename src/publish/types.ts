export type PublishInput = { caption: string; hashtags: string[]; assetUrl: string; format: string };
export interface Publisher {
  publish(channelId: string, input: PublishInput): Promise<{ platformPostId: string }>;
}
