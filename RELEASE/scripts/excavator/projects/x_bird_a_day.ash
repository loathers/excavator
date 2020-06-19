/**
 * @author gausie
 * Determine the relationship between Blessing of the Bird modifiers and the day seed
 */

import <excavator/x_utils.ash>

boolean [string] [string] modifier_keys = {
    "stat": $strings[Muscle Percent, Mysticality Percent, Moxie Percent],
    "element": $strings[Cold Resistance, Hot Resistance, Sleaze Resistance, Spooky Resistance, Stench Resistance],
    "attribute": $strings[Item Drop, Meat Drop, Monster Level, Combat Rate, Initiative, Experience],
    "bonus": $strings[HP Regen Min, Weapon Damage, Damage Absorption, MP Regen Min],
};

effect BLESSING = $effect[Blessing of the Bird];

string [string] get_blessing_modifiers()
{
    string [string] data;

    foreach type, key in modifier_keys
    {
        // We explicitly want a blank key for absent modifiers
        if ( data[ type ] == "" )
        {
            data[ type ] = "";
            data[ `{type}_value` ] = "";
        }

        // If this modifier is populated record its value
        if ( BLESSING.numeric_modifier( key ) != 0 )
        {
            data[ type ] = key;
            data[ `{type}_value` ] = BLESSING.numeric_modifier( key ).to_string();
        }
    }

    return data;
}

void spade_bird_a_day( string item_name, string page )
{
    // Bird-a-Day calendar
    if ( item_name != $item[Bird-a-Day calendar].to_string() )
    {
        return;
    }

    // Only track first use
    if ( page.contains_text( "You already read about today's bird." ) )
    {
        return;
    }

    string [string] data = combine_maps( get_blessing_modifiers(), get_day_seed() );

    send_spading_data( data, "Bird-a-Day" );
}

register_project( "CONSUME_REUSABLE", "spade_bird_a_day" );