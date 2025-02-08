use crate::creator::Creator;
use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Content {
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub content: String,
    pub content_type: ContentType,
    pub created_at: i64,
    pub updated_at: Option<i64>,
    pub total_views: u64,
    pub total_likes: u64,
    pub comments: Vec<Comment>,
    pub content_index: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, PartialEq)]
pub enum ContentType {
    #[default]
    Text,
    Image,
    Video,
    Audio,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Comment {
    pub creator: Pubkey,
    pub content: String,
    pub created_at: i64,
    pub is_edited: bool,
}

impl Content {
    pub const LEN: usize = 8
        + 32
        + (4 + 64)
        + (4 + 256)
        + (4 + 1024)
        + 1
        + 8
        + 9
        + 8
        + 8
        + 4
        + (32 + 4 + 256 + 8 + 1) * 10
        + 1
        + 8
        + 1;
}

#[derive(Accounts)]
#[instruction(
    title: String,
    description: String,
    content: String,
    content_type: ContentType,
    content_index: u64
)]
pub struct CreateContent<'info> {
    #[account(
        init,
        payer = authority,
        space = Content::LEN,
        seeds = [
            b"content",
            creator.key().as_ref(),
            &content_index.to_le_bytes()
        ],
        bump
    )]
    pub content: Account<'info, Content>,
    #[account(
        mut,
        constraint = creator.authority == authority.key() @ ErrorCode::UnauthorizedAccess,
        constraint = creator.is_active @ ErrorCode::CreatorNotActive
    )]
    pub creator: Account<'info, Creator>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create_content(
    ctx: Context<CreateContent>,
    title: String,
    description: String,
    content: String,
    content_type: ContentType,
    content_index: u64,
) -> Result<()> {
    require!(
        content_index == ctx.accounts.creator.total_content,
        ErrorCode::InvalidContentIndex
    );
    require!(!title.is_empty(), ErrorCode::EmptyTitle);
    require!(!content.is_empty(), ErrorCode::EmptyContent);
    require!(title.len() <= 64, ErrorCode::ContentTooLong);
    require!(description.len() <= 256, ErrorCode::ContentTooLong);
    require!(content.len() <= 1024, ErrorCode::ContentTooLong);

    msg!("Creating content");
    msg!("Title: {}", title);
    msg!("Description: {}", description);
    msg!("Content: {}", content);
    msg!("Content index: {}", content_index);
    msg!("Creator: {}", ctx.accounts.creator.key());
    msg!("Authority: {}", ctx.accounts.authority.key());
    msg!("Total content: {}", ctx.accounts.creator.total_content);

    let content_account = &mut ctx.accounts.content;
    content_account.creator = ctx.accounts.creator.key();
    content_account.title = title;
    content_account.description = description;
    content_account.content = content;
    content_account.content_type = content_type;
    content_account.created_at = Clock::get()?.unix_timestamp;
    content_account.updated_at = None;
    content_account.total_views = 0;
    content_account.total_likes = 0;
    content_account.comments = Vec::new();
    content_account.content_index = content_index;
    content_account.is_active = true;
    content_account.bump = ctx.bumps.content;

    ctx.accounts.creator.total_content = ctx
        .accounts
        .creator
        .total_content
        .checked_add(1)
        .ok_or(ErrorCode::MathOverflow)?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ContentDetails {
    pub id: Pubkey,
    pub creator: Pubkey,
    pub title: String,
    pub description: String,
    pub content: String,
    pub content_type: ContentType,
    pub created_at: i64,
    pub updated_at: Option<i64>,
    pub total_views: u64,
    pub total_likes: u64,
    pub comments: Vec<Comment>,
    pub content_index: u64,
    pub is_active: bool,
}

#[derive(Accounts)]
#[instruction(content_index: u64)]
pub struct FetchContentByIndex<'info> {
    #[account(
        seeds = [
            b"content",
            creator.key().as_ref(),
            &content_index.to_le_bytes()
        ],
        bump = content.bump,
    )]
    pub content: Account<'info, Content>,
    #[account()]
    pub creator: Account<'info, Creator>,
}

// #[derive(Accounts)]
// pub struct FetchCreator<'info> {
//     #[account(
//         seeds = [b"creator", authority.key().as_ref()],
//         bump,
//     )]
//     pub creator: Account<'info, Creator>,
//     pub authority: Signer<'info>,
// }

#[derive(Accounts)]
pub struct GetContent<'info> {
    #[account(
        seeds = [
            b"content",
            creator.key().as_ref(),
            &content.content_index.to_le_bytes()
        ],
        bump = content.bump,
    )]
    pub content: Account<'info, Content>,
    pub creator: Account<'info, Creator>,
}

#[derive(Accounts)]
pub struct InsertComment<'info> {
    #[account(
        mut,
        seeds = [
            b"content",
            content.creator.as_ref(),
            &content.content_index.to_le_bytes()
        ],
        bump = content.bump,
    )]
    pub content: Account<'info, Content>,
    pub authority: Signer<'info>,
}

pub fn insert_comment(ctx: Context<InsertComment>, content: String) -> Result<()> {
    require!(!content.is_empty(), ErrorCode::EmptyComment);
    require!(content.len() <= 256, ErrorCode::CommentTooLong);
    require!(
        ctx.accounts.content.comments.len() < 10,
        ErrorCode::TooManyComments
    );

    let comment = Comment {
        creator: ctx.accounts.authority.key(),
        content,
        created_at: Clock::get()?.unix_timestamp,
        is_edited: false,
    };

    ctx.accounts.content.comments.push(comment);
    Ok(())
}

pub fn fetch_content_by_index(
    ctx: Context<FetchContentByIndex>,
    content_index: u64,
) -> Result<ContentDetails> {
    let content = &ctx.accounts.content;
    Ok(ContentDetails {
        id: content.key(),
        creator: content.creator,
        title: content.title.clone(),
        description: content.description.clone(),
        content: content.content.clone(),
        content_type: content.content_type.clone(),
        created_at: content.created_at,
        updated_at: content.updated_at,
        total_views: content.total_views,
        total_likes: content.total_likes,
        comments: content.comments.clone(),
        content_index: content_index,
        is_active: content.is_active,
    })
}
