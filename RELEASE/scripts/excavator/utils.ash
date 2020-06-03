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

void add_spading_data( string [string] data, string project )
{
    data["_PROJECT"] = project;
    string reason = `Excavator's project to spade {project}`;

    string spading_data = `{data.to_json()}|{get_recipient()}|{reason}`;
    string current_data = get_property( "spadingData" );

    if ( current_data.index_of( spading_data ) > -1 )
    {
        return;
    }

    if ( current_data != "" && current_data.substring( current_data.length() ) != "|")
    {
        current_data += "|";
    }
    
    set_property( "spadingData", current_data + spading_data );
}

void register_project( string event, string function_name )
{
    REGISTERED_PROJECTS[event][count(REGISTERED_PROJECTS[event])] = function_name;
}

void call_registered_projects( string event, string page )
{
    foreach i, function_name in REGISTERED_PROJECTS[event]
    {
        call void function_name( page );
    }
}