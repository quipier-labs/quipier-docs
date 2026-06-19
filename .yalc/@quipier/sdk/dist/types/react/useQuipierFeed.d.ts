import type { Post, ReportReason } from "../types.js";
export interface UseQuipierFeedOptions {
    limit?: number;
    selectedPostId?: string | null;
    onSelectedPostIdChange?: (postId: string | null) => void;
}
export interface UseQuipierFeedResult {
    posts: Post[];
    selectedPost: Post | null;
    selectedPostId: string | null;
    replies: Post[];
    loading: boolean;
    detailLoading: boolean;
    repliesLoading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    selectPost(postId: string | null): void;
    refresh(): Promise<void>;
    loadMore(): Promise<void>;
    createPost(content: string, image?: string | null): Promise<Post>;
    createReply(postId: string, content: string, image?: string | null): Promise<Post>;
    updatePost(postId: string, content: string): Promise<void>;
    deletePost(postId: string): Promise<void>;
    toggleLike(postId: string): Promise<void>;
    reportPost(postId: string, reason: ReportReason): Promise<void>;
    clearError(): void;
}
export declare function useQuipierFeed(options?: UseQuipierFeedOptions): UseQuipierFeedResult;
//# sourceMappingURL=useQuipierFeed.d.ts.map