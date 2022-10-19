/**
 * @author midgleyc
 * Determine difficulty level of zones autumnaton is sent to.
 */

import <excavator/x_utils.ash>

static string lastQuestLocation;

void send_data(location l, string estimate, string evidence) {
    string [string] data = {
        "location": l,
        "prediction": estimate,
        "evidence": evidence,
    };

    send_spading_data(data, "Autumnaton");
}

boolean check_upgrade(location l, string page) {
    matcher autumn_matcher = create_matcher("Your autumn-aton also found an? (.+) to upgrade itself.", page);
    if (!autumn_matcher.find()) return false;
    string upgrade = autumn_matcher.group(1);
    string expected = `{l.difficulty_level} {l.environment}`;
    string actual = "";
    if (upgrade == "energy-absorptive hat") {
        actual = "low outdoor";
    } else if (upgrade == "high performance right arm") {
        actual = "mid outdoor";
    } else if (upgrade == "vision extender") {
        actual = "high outdoor";
    } else if (upgrade == "enhanced left arm") {
        actual = "low indoor";
    } else if (upgrade == "high speed right leg") {
        actual = "mid indoor";
    } else if (upgrade == "radar dish") {
        actual = "high indoor";
    } else if (upgrade == "upgraded left leg") {
        actual = "low underground";
    } else if (upgrade == "collection prow") {
        actual = "mid underground";
    } else if (upgrade == "dual exhaust") {
        actual = "high underground";
    }
    if (actual != expected) {
        send_data(l, actual, `Upgrade: {upgrade}`)
        return true;
    }
    return false;
}

boolean check_item(location l, string page) {
    string expected = `{l.difficulty_level} {l.environment}`;
    // if user has meltables, can't be sure as some Mafia envs are wrong
    if (item_amount($item[autumn debris shield]) > 0) {
        if (!page.contains_text("You acquire an item: <b>autumn debris shield")) {
            return false;
        }
        if ("mid outdoor" == expected) {
            return false;
        }
        send_data(l, "mid outdoor", "Item: autumn debris shield");
        return true;
    }
    if (item_amount($item[autumn leaf pendant]) > 0) {
        if (!page.contains_text("You acquire an item: <b>autumn leaf pendant")) {
            return false;
        }
        if ("high outdoor" == expected) {
            return false;
        }
        send_data(l, "high outdoor", "Item: autumn leaf pendant");
        return true;
    }
    if (item_amount($item[autumn sweater-weather sweater]) > 0) {
        if (!page.contains_text("You acquire an item: <b>autumn sweater-weather sweater")) {
            return false;
        }
        if ("low underground" == expected) {
            return false;
        }
        send_data(l, "low underground", "Item: autumn sweater-weather sweater");
        return true;
    }
    // user has no meltables
    matcher autumn_matcher = create_matcher("You acquire an item: <b>(autumn[^<]+)</b>", page);
    // first match is autumn-aton
    if (!autumn_matcher.find()) return false;
    if (!autumn_matcher.find()) return false;
    string acquired = autumn_matcher.group(1);
    string actual = "";
    if (acquired == "autumn leaf") {
        actual = "low outdoor";
    } else if (acquired == "AutumnFest Ale") {
        actual = "low indoor";
    } else if (acquired == "autumn-spice donut") {
        actual = "mid indoor";
    } else if (acquired == "autumn breeze") {
        actual = "high indoor";
    } else if (acquired == "autumn sweater-weather sweater") {
        actual = "low underground";
    } else if (acquired == "autumn dollar") {
        actual = "mid underground";
    } else if (acquired == "autumn years wisdom") {
        actual = "high underground";
    }
    if (actual != expected) {
        send_data(l, actual, `Item: {acquired}`)
        return true;
    }
    return false;
}

void end_quest(string l, string page) {
    location loc = l.to_location();
    if (check_upgrade(loc, page)) return;
    check_item(loc, page);
}

void spade_autumnaton(string meta, string page)
{
    string loc = get_property("autumnatonQuestLocation");
    if (loc != "") {
        lastQuestLocation = loc;
    }
    if (!page.contains_text("You acquire an item: <b>autumn-aton")) {
        // if the quest is done, the autumn-aton returns
        return;
    }
    if (lastQuestLocation == "") {
        // we don't know where the autumn-aton was sent
        return;
    }
    end_quest(lastQuestLocation, page);
    lastQuestLocation = "";
}

register_project( "COMBAT_ROUND", "spade_autumnaton" );
