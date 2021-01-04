/**
 * @author Phillammon
 * Determine the relationship between Fresh Coat of Paint modifiers and the day seed
 */

import <excavator/x_utils.ash>

boolean [string] [string] COAT_OF_PAINT_MODIFIERS = {
    "stat_experience": $strings[Muscle Experience, Mysticality Experience, Moxie Experience],
    "resist_element": $strings[Cold Resistance, Hot Resistance, Sleaze Resistance, Spooky Resistance, Stench Resistance],
    "damage_element": $strings[Cold Damage, Hot Damage, Sleaze Damage, Spooky Damage, Stench Damage],
};

item COAT_OF_PAINT = $item[Fresh Coat of Paint];
string COAT_BONUS_PATTERN = "Spells</font><br>(.+?)</font><br>Enchantments are different every day</font>";

string [string] get_paint_modifiers( string page )
{
    string [string] data;
    matcher m = COAT_BONUS_PATTERN.create_matcher( page );

    foreach type, key in COAT_OF_PAINT_MODIFIERS
    {
        // If this modifier is populated record its value
        if ( COAT_OF_PAINT.numeric_modifier( key ) != 0 )
        {
            data[ type ] = key;
        }
    }

    if ( m.find() )
    {
        string bonus = m.group( 1 );
        data[ "bonus" ] = bonus;
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

    string [string] data = combine_maps( get_paint_modifiers( page ), get_day_seed(), get_difficulty_seed() );
    send_spading_data( data, "Fresh Coat Of Paint" );
}

register_project( "DESC_ITEM", "spade_coat_of_paint" );
