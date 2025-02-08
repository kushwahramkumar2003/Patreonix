use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow error")]
    MathOverflow,
    #[msg("Content title, description or content is too long")]
    ContentTooLong,
    #[msg("Creator is not active")]
    CreatorNotActive,
    #[msg("Unauthorized access")]
    UnauthorizedAccess,
    #[msg("Invalid creator")]
    InvalidCreator,
    #[msg("Content not found")]
    ContentNotFound,
    #[msg("Content is not active")]
    ContentNotActive,
    #[msg("Invalid limit for content fetch")]
    InvalidLimit,
    #[msg("Too many comments")]
    TooManyComments,
    #[msg("Empty content not allowed")]
    EmptyContent,
    #[msg("Empty comment not allowed")]
    EmptyComment,
    #[msg("Invalid content index")]
    InvalidContentIndex,
    #[msg("Bump not found")]
    BumpNotFound,
    #[msg("Empty title not allowed")]
    EmptyTitle,
    #[msg("Comment is too long")]
    CommentTooLong,
    #[msg("Invalid content type filter")]
    InvalidFilter,
}
