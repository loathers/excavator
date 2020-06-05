/**
 * @author gausie
 * Submit data if an effect is obtained through a hookah-like mechanic that KoLmafia thinks shouldn't be possible
 */

import <excavator/x_utils.ash>;

string EFFECT_PATTERN = "<center><table><tr><td><img .*? onClick='eff\\(\"(.*?)\"\\);' width=30 height=30 alt=\"(.*?)\" title=";

// Return an effect given its descid
effect descid_to_effect( string descid )
{
    foreach eff in $effects[] if ( eff.descid == descid )
    {
        return eff;
    }

    return $effect[none];
}

// Returns the next effect gained after a given event trigger text
effect extract_effect_from_event( string page, string event_trigger_text )
{
    if ( !page.contains_text( event_trigger_text ) )
    {
        return $effect[none];
    }

    string pattern = `{event_trigger_text}.*?{EFFECT_PATTERN}`;
    matcher m = pattern.create_matcher(page);

    if ( m.find() )
    {
        string effect_descid = m.group(1);
        return effect_descid.descid_to_effect();
    }

    return $effect[none];
}

// Return whether this effect is considered obtainable via hookah by existing mafia data
boolean is_hookahable( effect eff )
{
    if ( eff.quality != "good" )
    {
        return false;
    }

    if ( eff.attributes.contains_text("nohookah") )
    {
        return false;
    }

    return true;
}

// Check an effect for a given hookah-like source and event trigger text, and spade the data if necessary
void check_hookah_source( string page, string source, string event_trigger_text )
{
    effect eff = page.extract_effect_from_event( event_trigger_text );

    if ( eff == $effect[none] || eff.is_hookahable() )
    {
        return;
    }

    // If we get here however, we have something to report
    string [string] data = {
        "source": source,
        "effect": eff.to_string(),
    };

    add_spading_data( data, "Hookah" );
}

// The ittah bittah hookah is a familiar equip that gives 6 adventures of a hookahable effect
void spade_hookah( string encounter, string page )
{
    if ( current_round() != 1 )
    {
        return;
    }

    if ( $item[ittah bittah hookah].equipped_amount() == 0 )
    {
        return;
    }

    page.check_hookah_source( "ittah bittah hookah", "takes a pull on the hookah" );
}

register_project( "COMBAT_ROUND", "spade_hookah" );

// Enhanced signal receiver is an off-hand item that gives 2-11 adventures of a hookahable effect
void spade_enhanced_signal_receiver( string encounter, string page )
{
    if ( current_round() != 0 )
    {
        return;
    }

    if ( $item[enhanced signal receiver].equipped_amount() == 0 )
    {
        return;
    }

    page.check_hookah_source( "enhanced signal receiver", "Your signal receiver pipes up:" );
}

register_project( "COMBAT_ROUND", "spade_enhanced_signal_receiver" );

// The crazy horse (acquired from The Horsery) is a slotless resource that gives 5 adventures of a hookahable effect
void spade_crazy_horse( string encounter, string page )
{
    if ( current_round() != 0 )
    {
        return;
    }

    if ( get_property( "_horsery" ) != "crazy horse" )
    {
        return;
    }

    page.check_hookah_source( "crazy horse", get_property( "_horseryCrazyName" ) );
}

register_project( "COMBAT_ROUND", "spade_crazy_horse" );