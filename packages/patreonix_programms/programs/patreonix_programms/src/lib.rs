use anchor_lang::prelude::*;

mod content;
mod creator;
mod errors;
mod state;

use content::*;
use creator::*;
use state::*;

declare_id!("CNuqSKiib2bVNZfvUbcYvFaAuPGtXwM6BeLZbrjYNB8M");

#[program]
pub mod patreonix_program {
    use super::*;

    // Initialize program state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Program initialized successfully");
        let state = &mut ctx.accounts.state;
        state.authority = ctx.accounts.authority.key();
        state.total_creators = 0;
        state.total_content = 0;
        Ok(())
    }

    // Creator instructions
    pub fn register_creator(
        ctx: Context<RegisterCreator>,
        name: String,
        email: Option<String>,
        bio: Option<String>,
        avatar: Option<String>,
    ) -> Result<()> {
        creator::register_creator(ctx, name, email, bio, avatar)
    }

    pub fn update_creator(
        ctx: Context<UpdateCreator>,
        name: Option<String>,
        email: Option<String>,
        bio: Option<String>,
        avatar: Option<String>,
    ) -> Result<()> {
        creator::update_creator(ctx, name, email, bio, avatar)
    }

    pub fn deactivate_creator(ctx: Context<UpdateCreator>) -> Result<()> {
        creator::deactivate_creator(ctx)
    }

    pub fn reactivate_creator(ctx: Context<UpdateCreator>) -> Result<()> {
        creator::reactivate_creator(ctx)
    }

    pub fn increment_supporters(ctx: Context<UpdateCreator>) -> Result<()> {
        creator::increment_supporters(ctx)
    }

    pub fn fetch_creator(ctx: Context<FetchCreator>) -> Result<CreatorInfo> {
        creator::fetch_creator(ctx)
    }

    // Content instructions
    pub fn create_content(
        ctx: Context<CreateContent>,
        title: String,
        description: String,
        content: String,
        content_type: ContentType,
        content_index: u64,
    ) -> Result<()> {
        content::create_content(
            ctx,
            title,
            description,
            content,
            content_type,
            content_index,
        )
    }

    pub fn fetch_content_by_index(
        ctx: Context<FetchContentByIndex>,
        content_index: u64,
    ) -> Result<ContentDetails> {
        content::fetch_content_by_index(ctx, content_index)
    }

    // Comment instructions
    pub fn insert_comment(ctx: Context<InsertComment>, content: String) -> Result<()> {
        content::insert_comment(ctx, content)
    }
}
