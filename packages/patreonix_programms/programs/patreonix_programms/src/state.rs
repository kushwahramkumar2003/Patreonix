use anchor_lang::prelude::*;

#[account]
pub struct ProgramState {
    pub authority: Pubkey,
    pub total_creators: u64,
    pub total_content: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 1, // discriminator + Pubkey + 2*u64 + bump
        seeds = [b"state"],
        bump
    )]
    pub state: Account<'info, ProgramState>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
