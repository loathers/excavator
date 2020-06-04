/**
 * @author gausie
 * Submit data if an effect is obtained through a hookah-like mechanice that KoLmafia thinks shouldn't be possible
 */

import <excavator/utils.ash>;

item ESR = $item[enhanced signal receiver];
string EFFECT_PATTERN = "<center><table><tr><td><img .*? onClick='eff\\(\"(.*?)\"\\);' width=30 height=30 alt=\"(.*?)\" title="

effect descid_to_effect( string descid )
{
    foreach eff in $effects[] if ( eff.descid == descid )
    {
        return eff;
    }

    return $effect[none];
}

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

void spade_enhanced_signal_receiver( string encounter, string page )
{
    if ( current_round() != 0 )
    {
        return;
    }

    if ( ESR.equipped_amount() == 0 )
    {
        return;
    }

    if ( !page.contains_text( "Your signal receiver pipes up:" ) )
    {
        return;
    }

    string ESR_PATTERN = `Your signal receiver pipes up: .*?\\.{EFFECT_PATTERN}`;
    matcher m = ESR_PATTERN.create_matcher(page);

    if ( m.find() )
    {
        string effect_descid = m.group(1);
        effect eff = effect_descid.descid_to_effect();

        if ( eff.is_hookahable() )
        {
            return;
        }

        // If we get here however, we have something to report
        string [string] data = {
            "source": ESR.to_string(),
            "effect": eff.to_string(),
        };

        add_spading_data( data, "Hookah" );
    }
}

register_project( "COMBAT_ROUND", "spade_enhanced_signal_receiver" );

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

    string CRAZY_HORSE_PATTERN = `{get_property( "_horseryCrazyName" )}.*?{EFFECT_PATTERN}`;
    matcher m = CRAZY_HORSE_PATTERN.create_matcher( page );

    if ( m.find() )
    {
        string effect_descid = m.group(1);
        effect eff = effect_descid.descid_to_effect();

        if ( eff.is_hookahable() )
        {
            return;
        }

        // If we get here however, we have something to report
        string [string] data = {
            "source": "crazy horse",
            "effect": eff.to_string(),
        };

        add_spading_data( data, "Hookah" );
    }
}

register_project( "COMBAT_ROUND", "spade_crazy_horse" );