/**
 * @author rinn
 * Determine the relationship between WLF Bunker operations and the day seed
 */

import <excavator/x_utils.ash>

void spade_wlf_bunker()
{
    string [int] props = {
        0: "_volcanoItem1", 1: "_volcanoItem2", 2: "_volcanoItem3",
        3: "_volcanoItemCount1", 4: "_volcanoItemCount2", 5: "_volcanoItemCount3"
    };

    string [string] operations = get_some_properties( props );

    // Convert from item id to string
    operations["_volcanoItem1"] = operations["_volcanoItem1"].to_int().to_item().to_string();
    operations["_volcanoItem2"] = operations["_volcanoItem2"].to_int().to_item().to_string();
    operations["_volcanoItem3"] = operations["_volcanoItem3"].to_int().to_item().to_string();

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

    spade_wlf_bunker();
}

void spade_wlf_bunker_choice( string url, string page )
{
    if ( !url.contains_text( "whichchoice=1093" ) )
    {
        return;
    }

    spade_wlf_bunker();
}

register_project( "CHOICE_VISIT", "spade_wlf_bunker_visit" );
register_project( "CHOICE", "spade_wlf_bunker_choice" );