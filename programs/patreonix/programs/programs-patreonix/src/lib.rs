use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod patreonix {
    use super::*;

    pub fn initialize_creator(ctx: Context<InitializeCreator>) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        creator.owner = *ctx.accounts.owner.key;
        creator.content_count = 0;
        creator.total_earnings = 0;
        Ok(())
    }

    pub fn create_content(ctx: Context<CreateContent>, ipfs_hash: String) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        let content = &mut ctx.accounts.content;
        
        content.creator = *ctx.accounts.creator.to_account_info().key;
        content.ipfs_hash = ipfs_hash;
        content.created_at = Clock::get()?.unix_timestamp;
        content.earnings = 0;
        
        creator.content_count += 1;
        
        Ok(())
    }

    pub fn subscribe(ctx: Context<Subscribe>, amount: u64) -> Result<()> {
        let transfer_instruction = Transfer {
            from: ctx.accounts.subscriber_token_account.to_account_info(),
            to: ctx.accounts.creator_token_account.to_account_info(),
            authority: ctx.accounts.subscriber.to_account_info(),
        };

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
            ),
            amount,
        )?;

        let creator = &mut ctx.accounts.creator;
        creator.total_earnings += amount;

        let content = &mut ctx.accounts.content;
        content.earnings += amount;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeCreator<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 8 + 8)]
    pub creator: Account<'info, Creator>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateContent<'info> {
    #[account(mut, has_one = owner)]
    pub creator: Account<'info, Creator>,
    #[account(init, payer = owner, space = 8 + 32 + 256 + 8 + 8)]
    pub content: Account<'info, Content>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Subscribe<'info> {
    #[account(mut)]
    pub creator: Account<'info, Creator>,
    #[account(mut)]
    pub content: Account<'info, Content>,
    #[account(mut)]
    pub subscriber: Signer<'info>,
    #[account(mut)]
    pub subscriber_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub creator_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Creator {
    pub owner: Pubkey,
    pub content_count: u64,
    pub total_earnings: u64,
}

#[account]
pub struct Content {
    pub creator: Pubkey,
    pub ipfs_hash: String,
    pub created_at: i64,
    pub earnings: u64,
}