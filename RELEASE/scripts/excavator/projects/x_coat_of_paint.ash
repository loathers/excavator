/**
 * @author Phillammon
 * Determine the relationship between Fresh Coat of Paint modifiers and the day seed
 */

import <excavator/x_utils.ash>

boolean [string] [string] modifier_keys = {
    "stat_experience": $strings[Muscle Experience, Mysticality Experience, Moxie Experience],
    "resist_element": $strings[Cold Resistance, Hot Resistance, Sleaze Resistance, Spooky Resistance, Stench Resistance],
    "damage_element": $strings[Cold Damage, Hot Damage, Sleaze Damage, Spooky Damage, Stench Damage],
    "bonus": $strings[Muscle Percent, Mysticality Percent, Moxie Percent, Maximum HP, Maximum MP, Initiative, Critical Hit Percent, Spell Critical Percent, Familiar Weight, Damage Reduction, Food Drop, Booze Drop, Candy Drop, Item Drop],
};

item PAINT = $item[Fresh Coat of Paint];

string [string] get_paint_modifiers()
{
    string [string] data;

    foreach type, key in modifier_keys
    {
        // If this modifier is populated record its value
        if ( PAINT.numeric_modifier( key ) != 0 )
        {
            data[ type ] = key;
            data[ `{type}_value` ] = PAINT.numeric_modifier( key ).to_string();
        }
    }

    return data;
}

void spade_coat_of_paint()
{
    string [string] data = combine_maps( get_paint_modifiers(), get_day_seed() );
    send_spading_data( data, "Fresh Coat Of Paint" );
}

register_daily_project( "spade_coat_of_paint" );