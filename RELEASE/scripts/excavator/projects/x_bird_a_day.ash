/**
 * @author gausie
 * Determine the relationship between Blessing of the Bird modifiers and the day seed
 */

import <excavator/x_utils.ash>

boolean [string] [string] modifier_keys = {
    "stat": $strings[Muscle Percent, Mysticality Percent, Moxie Percent],
    "element": $strings[Cold Resistance, Hot Resistance, Sleaze Resistance, Spooky Resistance, Stench Resistance],
    "attribute": $strings[Item Drop, Meat Drop, ML, Combat Rate, Initiative, Experience],
    "bonus": $strings[HP Regen Min, Bonus Weapon Damage, Damage Absorption, MP Regen Min],
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
        }

        // If this modifier is populated record its value
        if ( blessing.numeric_modifier( key ) != 0 )
        {
            data[ type ] = key;
            data[ `{type}_value` ] = blessing.numeric_modifier( key ).to_string();
        }
    }

    return data;
}

void spade_bird_a_day( string item_name, string page )
{
    if ( item_name.to_string() != $item[Bird-a-Day calendar].to_string() )
    {
        return;
    }

    string [string] data = combine_maps( get_blessing_modifiers(), get_day_seed() );

    add_spading_data( data, "Bird-a-Day" );
}

register_project( "CONSUME_USE", "spade_bird_a_day" );
register_project( "CONSUME_MULTIPLE", "spade_bird_a_day" );