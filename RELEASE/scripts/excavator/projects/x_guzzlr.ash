/**
 * @author gausie
 * Determine the relationship between Guzzlr deliveries and enchantments on the Guzzlr tablet accessory
 */

import <excavator/x_utils.ash>;

item GUZZLR_TABLET = $item[Guzzlr tablet];

// Retrieve Guzzlr tablet stats from its item description
string [string] get_guzzlr_tablet_stats()
{
    string desc = visit_url(`desc_item.php?whichitem={GUZZLR_TABLET.descid}`);

    matcher boozeDrop = "\\+(\\d+)% Booze Drops from Monsters".create_matcher( desc );
    matcher mpRegen = "Regenerate (\\d+)-(\\d+) MP per Adventure".create_matcher( desc );
    matcher hpRegen = "Regenerate (\\d+)-(\\d+) HP per Adventure".create_matcher( desc );

    string [string] results;

    if ( boozeDrop.find() )
    {
        results["Booze Drop"] = boozeDrop.group(1);
    }
    
    if ( mpRegen.find() )
    {
        results["MP Regen Min"] = mpRegen.group(1);
        results["MP Regen Max"] = mpRegen.group(2);
    }

    if ( hpRegen.find() )
    {
        results["HP Regen Min"] = hpRegen.group(1);
        results["HP Regen Max"] = hpRegen.group(2);
    }

    return results;
}

void spade_guzzlr( string encounter, string page )
{
    if ( current_round() != 0 )
    {
        return;
    }

    if ( GUZZLR_TABLET.available_amount() == 0 )
    {
        return;
    }

    if ( !page.contains_text( "You finally manage to track down" ) )
    {
        return;
    }

    string [string] stats = get_guzzlr_tablet_stats();

    string [string] deliveries = get_some_properties("guzzlrBronzeDeliveries", "guzzlrGoldDeliveries", "guzzlrPlatinumDeliveries");

    string [string] data = combine_maps( deliveries, stats );

    send_spading_data( data, "Guzzlr" );
}

register_project( "COMBAT_ROUND", "spade_guzzlr" );