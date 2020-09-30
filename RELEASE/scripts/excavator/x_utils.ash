import <zlib.ash>;

string [string] [int] REGISTERED_PROJECTS;
string DATA_PROPERTY = "spadingData";
string DEBUG_PROPERTY = "excavatorDebugMode";
string RECIPIENT_PROPERTY = "excavatorRecipient";
string LAST_PAGE_PROPERTY = "_excavatorLastPage";

string get_excavator_revision()
{
    int revision = svn_info("gausie-excavator-trunk-RELEASE").revision;
    if ( revision == 0 )
    {
        revision = svn_info("Excavator").revision;
    }

    return revision;
}

string get_recipient()
{
    string recipient = get_property( RECIPIENT_PROPERTY );
    return ( recipient != "" ) ? recipient : "Excavator";
}

string [string] get_some_properties( string ... props )
{
    string [string] map;
    foreach i, prop in props
    {
        map[prop] = get_property( prop );
    }
    return map;
}

string [string] combine_maps( string [string] ... maps )
{
    string [string] accumulator;
    foreach i, key, value in maps
    {
       accumulator[ key ] = value;
    }
    return accumulator;
}

string [string] get_day_seed()
{
    string [string] seed = {
        "daycount": my_daycount(),
        "class": my_class().to_int(),
        "path": my_path_id(),
    };

    return seed;
}

string [string] get_gameday_seed()
{
    string [string] seed = {
        "gameday": gameday_to_int(),
        "moonlight": moon_light(),
        "moonphase": moon_phase()
    };

    return seed;
}

string to_normalised_string( monster mon )
{
    return `[{mon.to_int()}]{mon.to_string()}`;
}

string to_normalised_string( item it )
{
    return `[{it.to_int()}]{it.to_string()}`;
}

boolean is_debug_mode()
{
    return get_property( DEBUG_PROPERTY ) != "";
}

boolean is_debug_mode( string event )
{
    string debug_prop = get_property( DEBUG_PROPERTY );

    if ( debug_prop == "true" )
    {
        return true;
    }

    foreach i, event_to_debug in debug_prop.split_string( "," ) if ( event_to_debug == event )
    {
        return true;
    }

    return false;
}

boolean can_kmail()
{
    if (
        // In a fight
        current_round() > 0 ||
        // In a choice
        handling_choice() ||
        // Was in a choice, gonna be in a fight
        fight_follows_choice() ||
        // Was in a fight, gonna be in a choice
        choice_follows_fight() ||
        // Was in a fight, gonna be in another fight
        in_multi_fight()
    )
    {
        return false;
    }

    return true;
}

string [string] default_replacements = {
    "pronoun-subj": "(he|she|it|they)",
    "pronoun-obj": "(him|her|it|them)",
    "pronoun-pos": "(his|her|its|their)",
    "part": ".*?",
    "number": "[0-9]+",
    "elemental": "<font color=[a-zA-Z]+><b>[0-9]+</b></font>",
};

boolean matches( string text, string pattern, string [string] replacements )
{
    foreach key, value in combine_maps( default_replacements, replacements )
    {
        pattern = pattern.replace_string( `<{key}>`, value );
    }

    matcher m = pattern.create_matcher( text );

    return m.find();
}

string get_spading_cache()
{
    return get_property( DATA_PROPERTY );
}

void set_spading_cache( string value )
{
    set_property( DATA_PROPERTY, value );
}

boolean is_spading_cache_empty()
{
    return get_spading_cache() == "";
}

void add_spading_data( string data, string recipient, string reason )
{
    string spading_data = `{data}|{recipient}|{reason}`;
    string current_data = get_spading_cache();

    if ( current_data.index_of( spading_data ) > -1 )
    {
        return;
    }

    if ( current_data != "" && current_data.substring( current_data.length() ) != "|" )
    {
        current_data += "|";
    }
    
    set_spading_cache( current_data + spading_data );
}

void flush_spading_data()
{
    string spading_data = get_spading_cache();

    // This will flush *all* spading data, not just that collected for Excavator.
    // I think that's fine? Noone uses this prop. But if they do, it would just be a
    // case of replacing this with a regex for `.*?|{get_recipient()}.*?` and then
    // selectively removing them with replace_all or something
    string [int] pieces = spading_data.split_string( "\\|" );

    int i = 0;
    while ( i < count(pieces) - 2 )
    {
        string contents = pieces[i];
        string recipient = pieces[++i];
        string explanation = pieces[++i];
        boolean success = kmail(recipient, contents, 0);
        if ( !success )
        {
            print( "Sending a kmail failed while Excavator was flushing the spading cache. Flush aborted.", "red" );
            return;
        }
        i++;
    }

    set_spading_cache( "" );
}

void send_spading_data( string [string] data, string project )
{
    data["_PROJECT"] = project;
    data["_VERSION"] = `{get_revision()}/{get_excavator_revision()}`;
    string data_string = data.to_json();

    // KoL adds spaces using v1.1 of htmlwrap (https://greywyvern.com/code/php/htmlwrap)
    // Rather than try to backwards engineer this, I'll just replace all spaces with +
    // and then treat spaces as hostile on the processing server. This obviously means
    // that data cannot contain a + sign. We'll have to solve that when we come to it.
    data_string = data_string.url_encode();

    string recipient = get_recipient();

    if ( can_kmail() )
    {
        string flush_message = is_spading_cache_empty() ? "" : ", as well as some other data we couldn't send before, ";
        print_html( `<font color="green">Sending spading data for <b>{project}</b>{flush_message} to {recipient}. Thanks!</font>` );
        boolean success = kmail( recipient, data_string, 0 );

        if ( success )
        {
            flush_spading_data();
            return;
        }
        else
        {
            print( "Excavator thought it could send data via kmail but it can't. Saving to cache instead.", "orange" );
        }
    }

    string reason = `Excavator's project to spade {project}`;

    add_spading_data( data_string, recipient, reason );
}

void register_project( string event, string function_name )
{
    REGISTERED_PROJECTS[event][count(REGISTERED_PROJECTS[event])] = function_name;
}

void call_registered_projects( string event, string meta, string page )
{
    if ( is_debug_mode() )
    {
        print( `[{event}] {meta}`, "blue" );
        set_property( LAST_PAGE_PROPERTY, page );
    }

    foreach i, function_name in REGISTERED_PROJECTS[ event ]
    {
        if ( is_debug_mode() )
        {
            print( `Calling '{function_name}'`, "blue" );
        }

        call void function_name( meta, page );
    }
}