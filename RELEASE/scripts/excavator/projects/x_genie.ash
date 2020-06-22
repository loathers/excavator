/**
 * @author gausie
 * Determine which monsters and effects can be fought/acquired with the Genie.
 */

import <excavator/x_utils.ash>

void spade_genie( string page )
{
    // Check page validity
    if ( !page.contains_text( "<b>Results:</b>" ) )
    {
        return;
    }

    // Find our wish or bail out
    matcher m = "You announce, \"I wish (.*?)\"<".create_matcher( page );

    if ( !m.find() )
    {
        return;
    }

    string wish = m.group( 1 ).to_lower_case();

    // Determine if this was a success
    boolean success = !page.contains_text( "<br />You could try, " );

    string [string] data = {
        "success": success,
    };

    boolean wishable;
    matcher fight_matcher = "(?:(?:to fight|i (?:was|were) fighting) (?:a )?)(.*)".create_matcher( wish );
    // This will match fights, but is checked afterwards
    matcher effect_matcher = "(?:to be|i (?:was|were)) (?!big|a baller|rich|a little bit taller)(.*)".create_matcher( wish );

    //  Determine wishability for fight and prepare data map
    if ( fight_matcher.find() )
    {
        monster mon = fight_matcher.group( 1 ).to_monster();

        if ( mon == $monster[none] )
        {
            return;
        }

        data["type"] = "monster";
        data["value"] = mon.to_string();

        wishable = !mon.boss && mon.copyable;
    }
    // Determine wishability for effect and prepare data map
    else if ( effect_matcher.find() )
    {
        effect eff = effect_matcher.group( 1 ).to_effect();

        if ( eff == $effect[none] )
        {
            return;
        }

        data["type"] = "effect";
        data["value"] = eff.to_string();

        wishable = !eff.attributes.contains_text( "nohookah" );
    }
    else
    {
        return;
    }

    // We expect wishables to be successes and visa versa
    if ( success == wishable )
    {
        return;
    }

    // If we get here something needs reporting
    send_spading_data( data, "Genie" );
}

void spade_genie_choice_visit( string choice, string page )
{
    if ( choice.to_int() != 1267 )
    {
        return;
    }

    spade_genie( page );
}

void spade_genie_choice( string url, string page )
{
    if ( !url.contains_text( "whichchoice=1267" ) )
    {
        return;
    }

    spade_genie( page );
}

register_project( "CHOICE_VISIT", "spade_genie_choice_visit" );
register_project( "CHOICE", "spade_genie_choice" );