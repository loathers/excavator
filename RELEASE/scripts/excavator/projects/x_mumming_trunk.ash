/**
 * @author gausie
 * Record instances of a familiar indicating that it has a previous undetected attribute through mumming trunk bonuses.
 */

import <excavator/x_utils.ash>;

boolean [string][string][string] attribute_indicators = {
    "1": {
        "hands": {
            "Captain <name> waves his hands at you until you notice the Meat he's found.": true,
            "Captain <name> distracts your opponent with his left hand while punching the Meat out of their pockets with the other.": true,
            "Captain <name> emits an enthusiastic \"Arrrr,\" grabs a shovel, and digs up some extra Meat for you.": true,
            "Captain <name> rubs his hands together gleefully, thinking about all the Meat he's gonna carve off your foe.": true,
        },
        "undead": {
            "<name> shows your opponent what's under his Captain's eyepatch. They shudder.": true,
            "Moonlight hits <name>, revealing The Captain's terrible curse! Your opponent reels in horror.": true,
            "Captain <name> threatens to send your foe to Mickey Dolenz's locker, which makes them a little nervous.": true,
            "Captain <name> threatens to make your opponent kiss the gunner's daughter. They seem a bit shaken by this.": true,
        },
    },
    "2": {
        "wings": {
            "<name> beats his wings, building up a static charge in his little Beelzebub pitchfork, which he then jabs you in the skull with.": true,
            "<name> flaps his wings until he builds up a good static charge, then jabs you with his little Beelzebub pitchfork. Zzzap!": true,
            "<name> flies up above you and fires little lightning bolts from his little pitchfork at your head, painfully refilling your MP.": true,
            "<name> waggles his wings at you to distract you, then jabs you with his Beelzebub pitchfork. This refills your MP, somehow.": true,
        },
        "hot": {
            "<name>'s little Beelzebub pitchfork glows red hot as he plunges it into your foe's": true,
            "<name>'s little devil pitchfork heats up with the fires of hell, or possibly some sort of electrical heating coil, and causes": true,
            "<name> pours kerosene on his Beelzebub pitchfork and lights it on fire before stabbing your opponent for": true,
            "<name> lights his pitchfork on fire before stabbing your foe, adding injury to more injury.": true,
        },
    },
    "3": {
        "animal": {
            "<name> growls and roars in typical Saint Patrick fashion, encouraging you to action.": true,
            "<name> roars like a savage beast, straining against his Saint Patrick costume. It's very inspiring!": true,
            "Saint <name> barks or howls or makes whatever sort of excited animal noise is appropriate for a thing like <name>, and this gets you pumped up.": true,
            "You give Saint <name> a pat on the head, which might possibly be sacrilegious, and uh... I guess that results in you getting a little stronger somehow.": true,
        },
        "biting": {
            "<name> bares her fangs at your foe in a not-particularly-saintly way; your foe hesitates for a moment.": true,
            "and shakes them violently, as Saint Patrick was famous for doing all the time.": true,
            "<name> chomps your foe on the head and refuses to let go. That's that famous Saint Patrick tenacity at work.": true,
            "<name>, clad in his already-intimidating Saint Patrick costume, bares his teeth even more intimidatingly. Your opponent is far too intimidated to attack.": true,
        },
    },
    "4": {
        "clothes": {
            "<name> smooths his purple crushed velvet suit and adjusts his lace cravat, then does an elaborate sexy dance for you. Unless you have put this costume on an underage familiar, in which case the dance is not sexy.": true,
            "<name>, dressed to the nines in his fancy Prince George costume, orders a random passerby to bring him some extra items. So haughty!": true,
            "Prince <name> does a regal dance. Some kind of waltz or something I guess? One of those dances with a lot of bowing and turning around.": true,
            "Prince <name> orders his servants to bring a mirror so he can adjust his clothes, then orders some more servants to bring him some new clothes.": true,
        },
        "quick": {
            "As quick as a wink, <name> sneaks up behind your opponent and stabs him with a tiny sword, dealing X damage. So much blood!": true,
            "Prince <name> charges in and impales your foe on his sword before they can even react, causing X damage!": true,
            "<name> swoops in like a bolt of regal lightning and stabs your opponent for X damage!": true,
            "Prince <name> dashingly dashes in and dashes your foe to the ground - - - for X damage!": true,
        },
    },
    "5": {
        "eyes": {
            "<name> peers at a tactical map of the area and pushes some little toy soldiers around it with a bent stick.": true,
            "<name> scans the horizon with her little field binoculars and gives you some Oliver Cromwellian intelligence updates.": true,
            "<name> blinks her eyes intelligently, like Oliver Cromwell would. Some of that intelligence rubs off on you.": true,
            "<name> adjusts her little Oliver Cromwell glasses and makes some helpful adjustments to your to-do list.": true,
        },
        "flying": {
            "From his position above the battlefield, <name> helps you get the jump on your foe in typical Oliver Cromwell style.": true,
            "<name> shouts some intel about enemy troop formations down at you from his position over the battlefield. Because that's something Oliver Cromwell did.": true,
            "<name> dissolves the Rump Parliament and is elected Lord Protector of England by your other familiars. Also, you win initiative.": true,
            "<name> waves her saber in the air and orders a cavalry charge, taking your foe by surprise.": true,
        },
    },
    "6": {
        "mechanical": {
            "<name>, dressed as The Doctor, gives you a quick MRI.": true,
            "<name> consults some bleeping Doctor-type machines and writes you a prescription.": true,
            "Doctor <name> puts a stick in your mouth and shines a light-up gadget in your eyes. For some reason, you feel better.": true,
            "<name>, dressed as The Doctor, jumps into his time machine and... what? Just a regular doctor? Oh.": true,
            "...I guess he just gives you some pills or something then.": true,
        },
        "evil": {
            "Doctor <name> writes your opponent a prescription for": true,
            "Doctor <name> gets an evil glint in his eye, and another in his scalpel, and ": true,
            "<name> puts a pinky (or pinky-analogue) to the corner of his mouth and sneers something about a billion Meat. Your opponent sighs so heavily, they cause": true,
            "With an evil grin, <name> pulls a wicked-looking medical instrument out of the coat of his Doctor costume and jabs your opponent for": true,
        },
    },
    "7": {
        "sleazy": {
            "<name> tells you a joke so dirty, you're pretty sure even Miss Funny wouldn't stand for it.": true,
            "<name>, in his Miss Funny costume, tells you a joke so filthy you barely even understand it.": true,
            "<name> tells you Miss Funny's version of \"The Aristocrats\": true, which is way filthier than you might expect.": true,
            "<name>, dressed as Miss Funny, tells an extremely bawdy joke. Far too bawdy to include here. Just... very very bawdy.": true,
        },
        "bug": {
            "<name> plays a great Miss Funny-style trick on your opponent, filling their pants with live bees.": true,
            "<name> plays a hilarious Miss Funny prank on your foe, laying a clutch of eggs in his mouth and dealing": true,
            "<name> vomits corrosive stomach secretions onto your opponent, causing": true,
            "<name> tricks your foe by summoning a swarm of greasy locusts to devour them for": true,
        },
    },
};

void spade_mumming_trunk( string encounter, string page )
{
    // Do we have a mumming trunk
    if ( $item[mumming trunk].available_amount() == 0 )
    {
        return;
    }

    string mummery_uses = get_property( "_mummeryUses" );

    // Have we used it
    if ( mummery_uses == "" )
    {
        return;
    }

    familiar fam = my_familiar();

    // Have we used it on our active familiar
    if ( !get_property( "_mummeryMods" ).contains_text( fam.to_string() ) )
    {
        return;
    }

    string [int] costumes_used = mummery_uses.split_string( "," );

    // There's no simple way of querying what costume a given familiar is wearing, but it's not
    // a massive issue to just check if its wearing *any* and then cycle through all used costumes.
    foreach i, costume in costumes_used
    {
        foreach attribute, indicator in attribute_indicators[ costume ] if ( !fam.attributes.contains_text( attribute ) )
        {
            indicator = indicator.replace_string( "<name>", fam.name );

            if ( page.contains_text( indicator ) )
            {
                string [string] data = {
                    "attribute": attribute,
                    "familiar": fam.to_string(),
                };

                send_spading_data( data, "Mumming Trunk" );
            }
        }
    }
}

register_project( "COMBAT_ROUND", "spade_mumming_trunk" );