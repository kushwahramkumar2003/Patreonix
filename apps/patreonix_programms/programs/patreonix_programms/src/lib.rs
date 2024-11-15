use anchor_lang::prelude::*;

declare_id!("5uh6s9rCQaPKbfdZ31opFWeUigSdzZrA6obGFtp4PFde");

#[program]
pub mod patreonix_programms {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
