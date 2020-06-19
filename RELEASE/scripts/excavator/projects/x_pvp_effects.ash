/**
 * @author gausie
 * Determine which effects are decremented by PvP fights.
 */

import <excavator/x_utils.ash>

void spade_pvp_effects( string url, string page )
{
    int [effect] before = my_effects();
    visit_url( "api.php?what=status&for=KoLmafia" );
    int [effect] after = my_effects();

    foreach eff, turns_before in before if ( turns_before > 0 )
    {
        boolean decremented = turns_before > after[eff];
        boolean no_pvp = eff.attributes.contains_text( "nopvp" );

        // With the nopvp command we expect the effect not to decrement, and visa versa
        if ( no_pvp == !decremented )
        {
            continue;
        }

        string [string] data = {
            "effect": eff.to_string(),
            "decremented": decremented,
        };

        send_spading_data( data, "PvP Effects" );
    }
}

register_project( "PVP", "spade_pvp_effects" );