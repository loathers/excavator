/**
 * @author rinn
 * Determine the relationship between WLF Bunker operations and the day seed
 */

import <excavator/x_utils.ash>

void spade_wlf_bunker( string page )
{
    // Extract the items from the page manually, properties are not set on first page visit
    string pattern = `onclick='descitem\\(\\d+\\)' alt=".+?" title=".+?">(.+?) (?:\\((\\d)\\))?<\\/td>`;
    matcher m = pattern.create_matcher( page );

    string [string] operations;
    int index = 0;
    while ( m.find() )
    {
        index = index + 1;
        operations[`_volcanoItem{index}`] = m.group( 1 ).to_item().to_string();
        operations[`_volcanoItemCount1{index}`] = "1";
        if ( m.group( 2 ) != "" )
        {
            operations[`_volcanoItemCount1{index}`] = m.group( 2 );
        }
    }

    // Expecting exactly 3 results
    if ( index != 3 )
    {
        return;
    }

    // Ensure items are valid
    if ( operations["_volcanoItem1"] == "none" && operations["_volcanoItem2"] == "none" && operations["_volcanoItem3"] == "none" )
    {
        return;
    }

    string [string] data = combine_maps( operations, get_day_seed(), get_gameday_seed() );

    send_spading_data( data, "WLF Bunker" );
}

void spade_wlf_bunker_visit( string choice, string page )
{
    if ( choice.to_int() != 1093 )
    {
        return;
    }

    spade_wlf_bunker( page );
}

void spade_wlf_bunker_choice( string url, string page )
{
    if ( !url.contains_text( "whichchoice=1093" ) )
    {
        return;
    }

    spade_wlf_bunker( page );
}

register_project( "CHOICE_VISIT", "spade_wlf_bunker_visit" );
register_project( "CHOICE", "spade_wlf_bunker_choice" );