/**
 * @author rinn
 * Track beach comb squares
 */

import <excavator/x_utils.ash>

void spade_beach_comb( string url, string page )
{
    string pattern = `coords=(\\d+)%2C(\\d+)`;
    matcher m = pattern.create_matcher( url );
    if (!m.find()) return;

    int row = m.group(1).to_int();
    int rest = m.group(2).to_int();
    int mod = (rest % 10);
    int beach = (rest / 10) + (mod == 0 ? 0 : 1);
    int col = (mod == 0) ? 0 : (10 - mod);

    foreach x,val in get_property("_beachLayout").split_string(":")
    {
        foreach y,square in val.split_string("")
        {
            // Log twinkling or whales
            if (square == "t" || square == "W") {

                string [string] twinkle_data;
                twinkle_data["Minute"] = beach;
                twinkle_data["Row"] = x.to_int();
                twinkle_data["Column"] = y.to_int() + 1;
                twinkle_data["Twinkle"] = true;

                send_spading_data( twinkle_data, "Beach Comb Twinkle" );
            }
        }
    }

    string rarity = "";

    if (page.contains_text("already combed this spot")) return;
    else if (page.contains_text("which is not particularly interesting")) rarity = "frequent";
    else if (page.contains_text("demolish the sand castle")) rarity = "frequent";
    else if (page.contains_text("oh hey")) rarity = "infrequent";
    else if (page.contains_text("piece of driftwood buried under the sand")) rarity = "scarce";
    else if (page.contains_text("pirate treasure chest")) rarity = "scarce";
    else if (page.contains_text("meat off the whale carcass")) rarity = "scarce";
    else if (page.contains_text("except for a weird rock")) rarity = "scarce";

    if (rarity != "")
    {
        // An infrequent or scarce tile also twinkles
        // _beachLayout is updated with the combed spot before the spading script is run so it won't be logged above
        if (rarity == "infrequent" || rarity == "scarce")
        {
            string [string] twinkle_data;
            twinkle_data["Minute"] = beach;
            twinkle_data["Row"] = row;
            twinkle_data["Column"] = col;
            twinkle_data["Twinkle"] = true;

            send_spading_data( twinkle_data, "Beach Comb Twinkle" );
        }

        string [string] data;
        data["Minute"] = beach;
        data["Row"] = row;
        data["Column"] = col;
        data["Rarity"] = rarity;

        send_spading_data( data, "Beach Comb Rarity" );
    }
}

void spade_beach_comb_choice( string url, string page )
{
    if ( !url.contains_text( "whichchoice=1388" ) )
    {
        return;
    }

    spade_beach_comb( url, page );
}

register_project( "CHOICE", "spade_beach_comb_choice" );
