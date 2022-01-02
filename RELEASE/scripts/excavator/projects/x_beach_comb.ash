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

    string rarity;

    string alreadyCombed = "already combed this spot";
    string frequent = "which is not particularly interesting";
    string frequentSandCastle = "demolish the sand castle"; // frequent
    string infrequent = "oh hey!";
    string scarseDriftwood = "piece of driftwood buried under the sand";
    string scarsePirate = "pirate treasure chest";
    string scarseWhale = "meat off the whale carcass";
    string scarseFragment = "except for a weird rock";

    if (page.contains_text("already combed this spot")) return;
    else if (page.contains_text("which is not particularly interesting")) rarity = "frequent";
    else if (page.contains_text("demolish the sand castle")) rarity = "frequent";
    else if (page.contains_text("oh hey")) rarity = "infrequent";
    else if (page.contains_text("piece of driftwood buried under the sand")) rarity = "scarse";
    else if (page.contains_text("pirate treasure chest")) rarity = "scarse";
    else if (page.contains_text("meat off the whale carcass")) rarity = "scarse";
    else if (page.contains_text("except for a weird rock")) rarity = "scarse";

    if (rarity == "") return;

    string [string] data;
    data["Minute"] = beach;
    data["Row"] = row;
    data["Column"] = col;
    data["Rarity"] = rarity;

    print(data);

    //send_spading_data( data, "Beach Comb" );
}

void spade_beach_comb_choice( string url, string page )
{
    print(url);
    if ( !url.contains_text( "whichchoice=1388" ) )
    {
        return;
    }

    spade_beach_comb( url, page );
}

register_project( "CHOICE", "spade_beach_comb_choice" );
