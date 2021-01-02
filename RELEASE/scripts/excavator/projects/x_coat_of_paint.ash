/**
 * @author Phillammon
 * Determine the relationship between Fresh Coat of Paint modifiers and the day seed
 */

import <excavator/x_utils.ash>

boolean [string] [string] COAT_OF_PAINT_MODIFIERS = {
    "stat_experience": $strings[Muscle Experience, Mysticality Experience, Moxie Experience],
    "resist_element": $strings[Cold Resistance, Hot Resistance, Sleaze Resistance, Spooky Resistance, Stench Resistance],
    "damage_element": $strings[Cold Damage, Hot Damage, Sleaze Damage, Spooky Damage, Stench Damage],
    "bonus": $strings[Muscle Percent, Mysticality Percent, Moxie Percent, Maximum HP, Maximum MP, Initiative, Critical Hit Percent, Spell Critical Percent, Familiar Weight, Damage Reduction, Food Drop, Booze Drop, Candy Drop, Item Drop],
};

item COAT_OF_PAINT = $item[Fresh Coat of Paint];

string [string] get_paint_modifiers()
{
    string [string] data;

    foreach type, key in COAT_OF_PAINT_MODIFIERS
    {
        // If this modifier is populated record its value
        if ( COAT_OF_PAINT.numeric_modifier( key ) != 0 )
        {
            data[ type ] = key;
            data[ `{type}_value` ] = COAT_OF_PAINT.numeric_modifier( key ).to_string();
        }
    }

    return data;
}

void spade_coat_of_paint( string item_name, string page )
{
    if ( item_name.to_item() != COAT_OF_PAINT )
    {
        return;
    }

    if ( get_property( "_coatOfPaintModifier" ) == "" )
    {
        return;
    }

    string [string] data = combine_maps( get_paint_modifiers(), get_day_seed() );
    send_spading_data( data, "Fresh Coat Of Paint" );
}

register_project( "DESC_ITEM", "spade_coat_of_paint" );