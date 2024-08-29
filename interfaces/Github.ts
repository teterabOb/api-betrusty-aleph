export interface Github {
    reputation_level?: string,
    github_login: string;
    github_public_repos: number | string;
    github_public_gists: number | string;
    github_followers: number | string;
    github_following: number | string;
    github_created_at: string;  
    github_collaborators: string;
}