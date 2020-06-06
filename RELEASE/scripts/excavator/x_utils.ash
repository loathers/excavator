import <zlib.ash>;

string [string] [int] REGISTERED_PROJECTS;

string get_recipient()
{
    string recipient = get_property( "excavatorRecipient" );
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

boolean can_kmail()
{
    // In a fight
    if ( current_round() > 0 )
    {
        return false;
    }

    // In a choice
    if ( handling_choice() )
    {
        return false;
    }

    return true;
}

void add_spading_data( string data, string recipient, string reason )
{
    string spading_data = `{data}|{recipient}|{reason}`;
    string current_data = get_property( "spadingData" );

    if ( current_data.index_of( spading_data ) > -1 )
    {
        return;
    }

    if ( current_data != "" && current_data.substring( current_data.length() ) != "|" )
    {
        current_data += "|";
    }
    
    set_property( "spadingData", current_data + spading_data );
}

void flush_spading_data()
{
    string spading_data = get_property( "spadingData" );

    string [int] pieces = spading_data.split_string( "\\|" );

    int i = 0;
    while ( i < count(pieces) - 2 )
    {
        string contents = pieces[i];
        string recipient = pieces[++i];
        string explanation = pieces[++i];
        kmail(recipient, contents, 0);
        i++;
    }

    set_property( "spadingData", "" );
}

void send_spading_data( string [string] data, string project )
{
    data["_PROJECT"] = project;
    string data_string = data.to_json();

    // KoL adds spaces using v1.1 of htmlwrap (https://greywyvern.com/code/php/htmlwrap)
    // Rather than try to backwards engineer this, I'll just replace all spaces with +
    // and then treat spaces as hostile on the processing server. This obviously means
    // that data cannot contain a + sign. We'll have to solve that when we come to it.
    data_string = data_string.replace_string( " ", "+" );

    string recipient = get_recipient();

    if ( can_kmail )
    {
        kmail( recipient, data_string, 0 );
        flush_spading_data();
        return;
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
    foreach i, function_name in REGISTERED_PROJECTS[event]
    {
        call void function_name( meta, page );
    }
}