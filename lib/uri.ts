export const uriToPath = (uri: string) => {
  const [repo, , rkey] = parseAtUri(uri);
  return `/profile/${repo}/post/${rkey}`;
};
export const parseAtUri = (uri: string) => uri.split("/").slice(-3);
export const getRkey = (uri: string) => uri.split("/").at(-1);
