/**
 * @author gausie
 * Determine the relationship between initiative bonus and beeps from the GPS-tracking wristwatch during the Out of Order quest
 */

import <excavator/x_utils.ash>;

item GPS_WRISTWATCH = $item[GPS-tracking wristwatch];
string BEEP_PATTERN = "Your GPS tracker beeps ([0-9]+) times as it zeroes in on your quarry\\. You're confident that you'll track it down soon\\.";

void spade_out_of_order( string encounter, string page )
{
    // On the quest
    if ( get_property( "questESpOutOfOrder" ) == "unstarted" )
    {
        return;
    }

    // End of battle
    if ( current_round() != 0 )
    {
        return;
    }

    // Wearing the watch
    if ( GPS_WRISTWATCH.equipped_amount() == 0 )
    {
        return;
    }

    // In the jungle
    if ( my_location() != $location[The Deep Dark Jungle] )
    {
        return;
    }

    matcher m = BEEP_PATTERN.create_matcher( page );

    if ( !m.find() )
    {
        return;
    }

    string [string] data = {
        "beeps": m.group( 1 ),
        "initiative": numeric_modifier( "Initiative" ).to_string(),
    };

    send_spading_data( data, "Out of Order" );
}

register_project( "COMBAT_ROUND", "spade_out_of_order" );