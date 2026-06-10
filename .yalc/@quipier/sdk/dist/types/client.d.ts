import type { Comment, CreateCommentBody, CreatePostBody, ListCommentsResponse, ListPostsResponse, Post, ReportReason } from "./types.js";
export interface ClientConfig {
    apiBase: string;
    apiKey: string;
    getToken: () => string | null;
}
export declare class ApiError extends Error {
    readonly code: string;
    readonly status: number;
    constructor(status: number, code: string, message: string);
}
export declare function createClient(config: ClientConfig): {
    listComments(params: {
        project_id: string;
        page_id: string;
        cursor?: string;
        limit?: number;
    }): Promise<ListCommentsResponse>;
    createComment(body: CreateCommentBody): Promise<{
        comment: Comment;
    }>;
    deleteComment(id: string): Promise<void>;
    updateComment(id: string, content: string): Promise<void>;
    likeComment(id: string): Promise<{
        likes_count: number;
        liked_by_me: boolean;
    }>;
    unlikeComment(id: string): Promise<{
        likes_count: number;
        liked_by_me: boolean;
    }>;
    reportComment(id: string, reason: ReportReason): Promise<void>;
    listFeed(params: {
        project_id: string;
        cursor?: string;
        limit?: number;
    }): Promise<ListPostsResponse>;
    listReplies(params: {
        project_id: string;
        post_id: string;
        cursor?: string;
        limit?: number;
    }): Promise<ListPostsResponse>;
    getPost(params: {
        project_id: string;
        post_id: string;
    }): Promise<{
        post: Post;
    }>;
    createPost(body: CreatePostBody): Promise<{
        post: Post;
    }>;
    deletePost(id: string): Promise<void>;
    updatePost(id: string, content: string): Promise<void>;
    likePost(id: string): Promise<{
        likes_count: number;
        liked_by_me: boolean;
    }>;
    unlikePost(id: string): Promise<{
        likes_count: number;
        liked_by_me: boolean;
    }>;
    reportPost(id: string, reason: ReportReason): Promise<void>;
};
export type Client = ReturnType<typeof createClient>;
//# sourceMappingURL=client.d.ts.map