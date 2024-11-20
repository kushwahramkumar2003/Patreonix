use anchor_lang::prelude::*;

declare_id!("4iL34RsAAc1i4wYBCotcUoHdohPVZf5BBberACyxZ37Z");

#[program]
pub mod patreonix_programms {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn register_creator(
        ctx: Context<RegisterCreator>,
        name: String,
        email: Option<String>,
        bio: Option<String>,
    ) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        creator.authority = ctx.accounts.authority.key();
        creator.name = name;
        creator.email = email;
        creator.bio = bio;
        creator.registered_at = Clock::get()?.unix_timestamp;
        creator.is_active = true;
        creator.total_supporters = 0;
        msg!("Creator registered: {}", creator.name);
        Ok(())
    }

    pub fn fetch_creator(ctx: Context<FetchCreator>) -> Result<CreatorInfo> {
        let creator = &ctx.accounts.creator;
        Ok(CreatorInfo {
            name: creator.name.clone(),
            email: creator.email.clone(),
            bio: creator.bio.clone(),
            registered_at: creator.registered_at,
            is_active: creator.is_active,
            total_supporters: creator.total_supporters,
        })
    }

    pub fn update_creator(
        ctx: Context<UpdateCreator>,
        name: Option<String>,
        email: Option<String>,
        bio: Option<String>,
    ) -> Result<()> {
        let creator = &mut ctx.accounts.creator;

        if let Some(name) = name {
            creator.name = name;
        }
        if let Some(email) = email {
            creator.email = Some(email);
        }
        if let Some(bio) = bio {
            creator.bio = Some(bio);
        }

        msg!("Creator updated: {}", creator.name);
        Ok(())
    }

    pub fn deactivate_creator(ctx: Context<UpdateCreator>) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        creator.is_active = false;
        msg!("Creator deactivated: {}", creator.name);
        Ok(())
    }

    pub fn reactivate_creator(ctx: Context<UpdateCreator>) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        creator.is_active = true;
        msg!("Creator reactivated: {}", creator.name);
        Ok(())
    }

    pub fn increment_supporters(ctx: Context<UpdateCreator>) -> Result<()> {
        let creator = &mut ctx.accounts.creator;
        creator.total_supporters = creator.total_supporters.checked_add(1).unwrap();
        msg!("Supporters incremented for creator: {}", creator.name);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct RegisterCreator<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + // discriminator
               32 + // authority
               64 + // name
               64 + // email
               256 + // bio
               8 + // registered_at
               1 + // is_active
               8, // total_supporters
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

#[account]
#[derive(Default)]
pub struct Creator {
    pub authority: Pubkey,
    pub name: String,
    pub email: Option<String>,
    pub bio: Option<String>,
    pub registered_at: i64,
    pub is_active: bool,
    pub total_supporters: u64,
}

#[derive(Accounts)]
pub struct FetchCreator<'info> {
    #[account(
        seeds = [b"creator", authority.key().as_ref()],
        bump,
        has_one = authority
    )]
    pub creator: Account<'info, Creator>,
    pub authority: Signer<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default)]
pub struct CreatorInfo {
    pub name: String,
    pub email: Option<String>,
    pub bio: Option<String>,
    pub registered_at: i64,
    pub is_active: bool,
    pub total_supporters: u64,
}
