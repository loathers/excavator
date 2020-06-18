since r20180; // CONSUME_* events now triggered after mafia's result processing

import <excavator/x_utils.ash>;

// Projects
import <excavator/projects/x_bird_a_day.ash>;
import <excavator/projects/x_genie.ash>;
import <excavator/projects/x_guzzlr.ash>;
import <excavator/projects/x_hookah.ash>;
import <excavator/projects/x_mumming_trunk.ash>;
import <excavator/projects/x_voting_booth.ash>;

void main( string event, string meta, string page )
{
    call_registered_projects( event, meta, page );
}
