import { useMutation, useQuery } from "@tanstack/react-query";
import { deletePost, fetchComments } from "./api";
import "./PostDetail.css";

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => fetchComments(post.id),
  });

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId),
  });
  if (isLoading) return <h3>Loading ...</h3>;
  if (isError)
    return (
      <>
        <h3>!!!Oops...</h3>
        <h2>{error.toString()}</h2>
      </>
    );

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.isError && <p style={{ color: "red" }}>Have error !</p>}
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>Deleted post</p>
      )}
      {deleteMutation.isPending && (
        <p style={{ color: "purple" }}>Deleting post...</p>
      )}

      <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <>
          <li key={comment.id}>
            {comment.email}: {comment.body}
          </li>
        </>
      ))}
    </>
  );
}
