/**
 * @author gausie
 * Record instances of a familiar indicating that it has a previous undetected attribute through mumming trunk bonuses.
 */

import <excavator/x_utils.ash>;
import <zlib.ash>;

boolean [monster] MONSTER_PARTS_BLACKLIST = $monsters[the darkness (blind), Perceiver of Sensations, Performer of Actions, Thinker of Thoughts];

boolean planted_in( string plant, location loc )
{
    foreach l, i, p in get_florist_plants() if ( ( l == loc ) && ( p == plant ) )
    {
        return true;
    }

    return false;
}

record MonsterPartPattern {
    string type;
    string prereq;
    string pattern;
};

MonsterPartPattern [int] MONSTER_PART_PATTERNS = {
    new MonsterPartPattern( "effect", "Little Mouse Skull Buddy", "The cute little floating mouse skull nibbles at your opponent\'s (.+?), dealing \\d+? damage" ),
    new MonsterPartPattern( "equip", "battery-powered drill", "You drill a neat hole in your opponent's (.+?) which deals \\d+? damage" ),
    new MonsterPartPattern( "equip", "high-temperature mining drill", "You drill a neat hole in your opponent's (.+?) which deals \\d+? damage" ),
    new MonsterPartPattern( "familiar", "Adorable Seal Larva", "fangs your opponent in the (.+?) and greedily sucks the vital juices from the wound" ),
    new MonsterPartPattern( "familiar", "Adventurous Spelunker", "whips your opponent in the (.+?), dealing \\d+? damage" ),
    // new MonsterPartPattern( "familiar", "Bowlet", "flaps directly into your opponent's (.+?), causing \\d+? damage" ),
    new MonsterPartPattern( "familiar", "Left-Hand Man", "smacks your opponent in the (.+?) with the" ),
    new MonsterPartPattern( "item", "electronics kit", "You wire up a quick circuit and hook it to your opponent's (.+?)\\. You flip the switch" ),
    new MonsterPartPattern( "item", "small golem", "Your little golem punches your foe in the (.+?) for \\d+? damage" ),
    new MonsterPartPattern( "plant", "Rabid Dogwood", "The Rabid Dogwood jumps up and nails your opponent in the (.+?) in a misguided show of affection" ),
    new MonsterPartPattern( "skill", "Extract", "You reach into your foe's (.+?) and pull out some juicy, pulsating data" ),
    new MonsterPartPattern( "skill", "Hammer Smash", "You smack your foe right in the (.+?) with your hammer, dealing"),
    new MonsterPartPattern( "skill", "Shoot", "You draw your sixgun and shoot your foe right in the (.+?), dealing \\d+? damage" ),
    new MonsterPartPattern( "skill", "Stream of Sauce", "You blast it with a stream of hot .+?, dealing \\d+? damage. Right in the (.+?)" ),
    new MonsterPartPattern( "skill", "Ultrasonic Ululations", "You shriek in the direction of your foe\'s (.+?), vibrating it to the tune of \\d+? damage" ),
    new MonsterPartPattern( "skill", "Unleash Terra Cotta Army", "A terra cotta .+?s your foe(?: in the|'s) (.+?)(?:, dealing| with a fireball)" ),
    new MonsterPartPattern( "skill", "Utensil Twist", "You slap your .+? against the ground, kicking up a spark that strikes your foe in the (.+?), dealing \\d+? damage" ),
};

string [boolean] RESTRAINTS_PATTERNS = {
    false: "This foe doesn't have any arms that you can find",
    true: "You push the button on top of the restraints",
};

string MONSTER_PARTS_MAP = "monster_parts";

void check_and_report( monster mon, string part, boolean confirmation )
{
    boolean [monster][string] known_parts;

    load_current_map( MONSTER_PARTS_MAP , known_parts );

    if (
        !( known_parts[ mon ] contains part ) ||
        ( known_parts[ mon ][ part ] != confirmation )
    )
    {
        string [string] data = {
            "monster": mon.to_normalised_string(),
            "part": part.trim(),
            "confirmation": confirmation.to_string(),
        };

        send_spading_data( data, "Monster Parts" );

        known_parts[ mon ][ part ] = confirmation;

        map_to_file( known_parts, `{MONSTER_PARTS_MAP}.txt` );
    }
}

void spade_monster_parts( string encounter, string page )
{
    monster mon = last_monster();

    if ( MONSTER_PARTS_BLACKLIST contains mon )
    {
        return;
    }

    foreach i, mpp in MONSTER_PART_PATTERNS
    {
        if (
            ( mpp.type == "skill" && !mpp.prereq.to_skill().have_skill() ) ||
            ( mpp.type == "familiar" && mpp.prereq.to_familiar() != my_familiar() ) ||
            ( mpp.type == "effect" && mpp.prereq.to_effect().have_effect() == 0 ) ||
            ( mpp.type == "plant" && !mpp.prereq.planted_in( my_location() ) ) ||
            ( mpp.type == "equip" && !mpp.prereq.to_item().have_equipped() )
        )
        {
            continue;
        }

        matcher m = mpp.pattern.create_matcher( page );

        if ( m.find() )
        {
            string part = m.group( 1 );
            check_and_report( mon, part, true );
        }
    }

    foreach confirmation, pattern in RESTRAINTS_PATTERNS if ( page.contains_text( pattern ) )
    {
        check_and_report( mon, "arm", confirmation );
    }

    if ( current_round() == 1 && is_wearing_outfit( "Mutant Couture" ) )
    {
        string skills = page.excise( "<select name=whichskill>", "</select>" );

        if ( skills != "" )
        {
            check_and_report( mon, "head", skills.contains_text( `<option value="{$skill[Strangle].to_int()}"` ) );
            check_and_report( mon, "arm", skills.contains_text( `<option value="{$skill[Disarm].to_int()}"` ) );
            check_and_report( mon, "leg", skills.contains_text( `<option value="{$skill[Entangle].to_int()}"` ) );
        }
    }
}

register_project( "COMBAT_ROUND", "spade_monster_parts" );