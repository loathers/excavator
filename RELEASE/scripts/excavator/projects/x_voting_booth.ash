/**
 * @author gausie
 * Determine the relationship between voting initiatives and the day seed
 */

import <excavator/x_utils.ash>

void spade_voting_booth( string url, string page )
{
    if ( !url.contains_text( "whichchoice=1331" ) )
    {
        return;
    }

    string [string] initiatives = get_some_properties( "_voteLocal1", "_voteLocal2", "_voteLocal3", "_voteLocal4" );

    string [string] data = combine_maps( initiatives, get_day_seed() );

    send_spading_data( data, "Voting Booth" );
}

register_project( "CHOICE", "spade_voting_booth" );