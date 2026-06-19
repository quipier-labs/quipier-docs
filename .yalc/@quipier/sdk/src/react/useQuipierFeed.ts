import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError, createClient } from "../client.js";
import type { Post, ReportReason } from "../types.js";
import {
  useQuipierConfig,
  useQuipierSession,
} from "./context.js";

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

function message(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}

export function useQuipierFeed(
  options: UseQuipierFeedOptions = {},
): UseQuipierFeedResult {
  const config = useQuipierConfig();
  const sessionState = useQuipierSession();
  const limit = options.limit ?? 30;
  const controlled = options.selectedPostId !== undefined;

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [deepPost, setDeepPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPostId = controlled
    ? options.selectedPostId ?? null
    : internalSelectedId;

  const client = useMemo(
    () =>
      createClient({
        apiBase: config.apiBase ?? "https://api.quipier.com",
        apiKey: config.apiKey,
        getToken: () => sessionState.session?.sessionToken ?? null,
      }),
    [config.apiBase, config.apiKey, sessionState.session?.sessionToken],
  );

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof ApiError && err.status === 401) {
        sessionState.disconnect();
      }
      setError(message(err, fallback));
    },
    [sessionState],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.listFeed({
        project_id: config.projectId,
        limit,
      });
      setPosts(result.posts);
      setCursor(result.next_cursor);
    } catch (err) {
      handleError(err, "피드를 불러오지 못했습니다");
    } finally {
      setLoading(false);
    }
  }, [client, config.projectId, handleError, limit]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!selectedPostId) {
      setDeepPost(null);
      setReplies([]);
      return;
    }

    let cancelled = false;
    const inTimeline = posts.find((post) => post.id === selectedPostId);
    if (inTimeline) {
      setDeepPost(null);
    } else {
      setDetailLoading(true);
      client
        .getPost({ project_id: config.projectId, post_id: selectedPostId })
        .then(({ post }) => {
          if (!cancelled) setDeepPost(post);
        })
        .catch((err) => {
          if (!cancelled) handleError(err, "포스트를 불러오지 못했습니다");
        })
        .finally(() => {
          if (!cancelled) setDetailLoading(false);
        });
    }

    setRepliesLoading(true);
    client
      .listReplies({
        project_id: config.projectId,
        post_id: selectedPostId,
        limit: 100,
      })
      .then((result) => {
        if (!cancelled) setReplies(result.posts);
      })
      .catch((err) => {
        if (!cancelled) handleError(err, "답글을 불러오지 못했습니다");
      })
      .finally(() => {
        if (!cancelled) setRepliesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, config.projectId, handleError, posts, selectedPostId]);

  const selectPost = useCallback(
    (postId: string | null) => {
      if (!controlled) setInternalSelectedId(postId);
      options.onSelectedPostIdChange?.(postId);
    },
    [controlled, options],
  );

  const requireSession = useCallback(() => {
    if (sessionState.session) return;
    sessionState.connect();
    throw new ApiError(401, "UNAUTHORIZED", "패스포트 연결이 필요합니다");
  }, [sessionState]);

  const loadMore = useCallback(async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await client.listFeed({
        project_id: config.projectId,
        cursor,
        limit,
      });
      setPosts((current) => [...current, ...result.posts]);
      setCursor(result.next_cursor);
    } catch (err) {
      handleError(err, "피드를 더 불러오지 못했습니다");
    } finally {
      setLoadingMore(false);
    }
  }, [client, config.projectId, cursor, handleError, limit, loadingMore]);

  const createPost = useCallback(
    async (content: string, image?: string | null) => {
      requireSession();
      try {
        const result = await client.createPost({
          project_id: config.projectId,
          content,
          image: image ?? undefined,
        });
        setPosts((current) => [result.post, ...current]);
        return result.post;
      } catch (err) {
        handleError(err, "포스트를 작성하지 못했습니다");
        throw err;
      }
    },
    [client, config.projectId, handleError, requireSession],
  );

  const createReply = useCallback(
    async (postId: string, content: string, image?: string | null) => {
      requireSession();
      try {
        const result = await client.createPost({
          project_id: config.projectId,
          parent_id: postId,
          content,
          image: image ?? undefined,
        });
        setReplies((current) => [...current, result.post]);
        setPosts((current) =>
          current.map((post) =>
            post.id === postId
              ? { ...post, reply_count: post.reply_count + 1 }
              : post,
          ),
        );
        setDeepPost((post) =>
          post?.id === postId
            ? { ...post, reply_count: post.reply_count + 1 }
            : post,
        );
        return result.post;
      } catch (err) {
        handleError(err, "답글을 작성하지 못했습니다");
        throw err;
      }
    },
    [client, config.projectId, handleError, requireSession],
  );

  const updatePost = useCallback(
    async (postId: string, content: string) => {
      requireSession();
      try {
        await client.updatePost(postId, content);
        setPosts((current) =>
          current.map((post) => (post.id === postId ? { ...post, content } : post)),
        );
        setReplies((current) =>
          current.map((post) => (post.id === postId ? { ...post, content } : post)),
        );
        setDeepPost((post) => (post?.id === postId ? { ...post, content } : post));
      } catch (err) {
        handleError(err, "포스트를 수정하지 못했습니다");
        throw err;
      }
    },
    [client, handleError, requireSession],
  );

  const deletePost = useCallback(
    async (postId: string) => {
      requireSession();
      try {
        await client.deletePost(postId);
        const deleted = (post: Post): Post =>
          post.id === postId
            ? { ...post, is_deleted: true, content: "", image_url: null }
            : post;
        setPosts((current) => current.map(deleted));
        setReplies((current) => current.map(deleted));
        setDeepPost((post) => (post ? deleted(post) : post));
      } catch (err) {
        handleError(err, "포스트를 삭제하지 못했습니다");
        throw err;
      }
    },
    [client, handleError, requireSession],
  );

  const toggleLike = useCallback(
    async (postId: string) => {
      requireSession();
      const target =
        posts.find((post) => post.id === postId) ??
        replies.find((post) => post.id === postId) ??
        (deepPost?.id === postId ? deepPost : null);
      if (!target) return;
      const previous = {
        liked_by_me: target.liked_by_me,
        likes_count: target.likes_count,
      };
      const optimistic = (post: Post): Post => {
        if (post.id !== postId) return post;
        return {
          ...post,
          liked_by_me: !post.liked_by_me,
          likes_count: post.likes_count + (post.liked_by_me ? -1 : 1),
        };
      };
      setPosts((current) => current.map(optimistic));
      setReplies((current) => current.map(optimistic));
      setDeepPost((post) => (post ? optimistic(post) : post));

      try {
        const result = previous.liked_by_me
          ? await client.unlikePost(postId)
          : await client.likePost(postId);
        const reconcile = (post: Post): Post =>
          post.id === postId ? { ...post, ...result } : post;
        setPosts((current) => current.map(reconcile));
        setReplies((current) => current.map(reconcile));
        setDeepPost((post) => (post ? reconcile(post) : post));
      } catch (err) {
        const rollback = (post: Post): Post =>
          post.id === postId ? { ...post, ...previous } : post;
        setPosts((current) => current.map(rollback));
        setReplies((current) => current.map(rollback));
        setDeepPost((post) => (post ? rollback(post) : post));
        handleError(err, "좋아요를 변경하지 못했습니다");
      }
    },
    [client, deepPost, handleError, posts, replies, requireSession],
  );

  const reportPost = useCallback(
    async (postId: string, reason: ReportReason) => {
      requireSession();
      try {
        await client.reportPost(postId, reason);
      } catch (err) {
        handleError(err, "신고하지 못했습니다");
        throw err;
      }
    },
    [client, handleError, requireSession],
  );

  const selectedPost =
    posts.find((post) => post.id === selectedPostId) ??
    (deepPost?.id === selectedPostId ? deepPost : null);

  return {
    posts,
    selectedPost,
    selectedPostId,
    replies,
    loading,
    detailLoading,
    repliesLoading,
    loadingMore,
    error,
    hasMore: cursor !== null,
    selectPost,
    refresh,
    loadMore,
    createPost,
    createReply,
    updatePost,
    deletePost,
    toggleLike,
    reportPost,
    clearError: () => setError(null),
  };
}
