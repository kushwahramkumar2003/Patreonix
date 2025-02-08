use crate::errors::ErrorCode;
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct Creator {
    pub authority: Pubkey,
    pub name: String,
    pub email: Option<String>,
    pub bio: Option<String>,
    pub avatar: Option<String>,
    pub registered_at: i64,
    pub is_active: bool,
    pub total_supporters: u64,
    pub total_content: u64,
}

#[derive(Accounts)]
pub struct RegisterCreator<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + (4 + 64) + (1 + 4 + 64) + (1 + 4 + 256) + (1 + 4 + 256) + 8 + 1 + 8 + 8,
        seeds = [b"creator", authority.key().as_ref()],
        bump
    )]
    pub creator: Account<'info, Creator>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCreator<'info> {
    #[account(
        mut,
        seeds = [b"creator", authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub creator: Account<'info, Creator>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct FetchCreator<'info> {
    #[account(
        seeds = [b"creator", authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub creator: Account<'info, Creator>,
    /// CHECK: This is safe because we only need the authority's public key for PDA derivation
    /// and we validate the creator account's authority matches this key.
    pub authority: UncheckedAccount<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreatorInfo {
    pub name: String,
    pub email: Option<String>,
    pub bio: Option<String>,
    pub avatar: Option<String>,
    pub registered_at: i64,
    pub is_active: bool,
    pub total_supporters: u64,
    pub total_content: u64,
}

pub fn register_creator(
    ctx: Context<RegisterCreator>,
    name: String,
    email: Option<String>,
    bio: Option<String>,
    avatar: Option<String>,
) -> Result<()> {
    require!(name.len() <= 64, ErrorCode::ContentTooLong);
    require!(
        email.as_ref().map_or(true, |e| e.len() <= 64),
        ErrorCode::ContentTooLong
    );
    require!(
        bio.as_ref().map_or(true, |b| b.len() <= 256),
        ErrorCode::ContentTooLong
    );
    require!(
        avatar.as_ref().map_or(true, |a| a.len() <= 256),
        ErrorCode::ContentTooLong
    );

    let creator = &mut ctx.accounts.creator;
    creator.authority = ctx.accounts.authority.key();
    creator.name = name;
    creator.email = email;
    creator.bio = bio;
    creator.avatar = avatar;
    creator.registered_at = Clock::get()?.unix_timestamp;
    creator.is_active = true;
    creator.total_supporters = 0;
    creator.total_content = 0;
    Ok(())
}

pub fn update_creator(
    ctx: Context<UpdateCreator>,
    name: Option<String>,
    email: Option<String>,
    bio: Option<String>,
    avatar: Option<String>,
) -> Result<()> {
    let creator = &mut ctx.accounts.creator;
    if let Some(name) = name {
        require!(name.len() <= 64, ErrorCode::ContentTooLong);
        creator.name = name;
    }
    if let Some(email) = email {
        require!(email.len() <= 64, ErrorCode::ContentTooLong);
        creator.email = Some(email);
    }
    if let Some(bio) = bio {
        require!(bio.len() <= 256, ErrorCode::ContentTooLong);
        creator.bio = Some(bio);
    }
    if let Some(avatar) = avatar {
        require!(avatar.len() <= 256, ErrorCode::ContentTooLong);
        creator.avatar = Some(avatar);
    }
    Ok(())
}

pub fn deactivate_creator(ctx: Context<UpdateCreator>) -> Result<()> {
    ctx.accounts.creator.is_active = false;
    Ok(())
}

pub fn reactivate_creator(ctx: Context<UpdateCreator>) -> Result<()> {
    ctx.accounts.creator.is_active = true;
    Ok(())
}

pub fn increment_supporters(ctx: Context<UpdateCreator>) -> Result<()> {
    let creator = &mut ctx.accounts.creator;
    creator.total_supporters = creator
        .total_supporters
        .checked_add(1)
        .ok_or(ErrorCode::MathOverflow)?;
    Ok(())
}

pub fn fetch_creator(ctx: Context<FetchCreator>) -> Result<CreatorInfo> {
    let creator = &ctx.accounts.creator;
    Ok(CreatorInfo {
        name: creator.name.clone(),
        email: creator.email.clone(),
        bio: creator.bio.clone(),
        avatar: creator.avatar.clone(),
        registered_at: creator.registered_at,
        is_active: creator.is_active,
        total_supporters: creator.total_supporters,
        total_content: creator.total_content,
    })
}
