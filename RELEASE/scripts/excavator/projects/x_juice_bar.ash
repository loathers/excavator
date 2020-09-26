/**
 * @author rinn
 * Determine the relationship between Chateau Mantegna Continental Juice Bar potions and the day seed
 */

import <excavator/x_utils.ash>

void spade_continental_juice_bar( string url, string page )
{
    // place.php?whichplace=chateau&action=chateau_desk or
    // place.php?whichplace=chateau&action=chateau_desk2
    if ( !url.contains_text( "whichplace=chateau&action=chateau_desk" ) )
    {
        return;
    }

    // Verify this page is the juice bar
    if ( !page.contains_text( "survey the array of exotic juices" ) )
    {
        return;
    }

    string [string] results;

    // Extract the items from the page manually
    // extract_items() returns an item -> count map that doesn't maintain order so we can't use it
    string pattern = `You acquire an item: <b>(.*?)</b>`
    matcher m = pattern.create_matcher( page );

    int index = 0;
    while ( m.find() )
    {
        index = index + 1;
        results[`item{index}`] = m.group( 1 );
    }

    string [string] data = combine_maps( results, get_day_seed() );

    send_spading_data( data, "Continental Juice Bar" );
}

register_project( "PLACE", "spade_continental_juice_bar" );