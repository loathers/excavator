since r20145; // Support for spadingScripts with third param

import <excavator/x_utils.ash>;

// Projects
import <excavator/projects/x_guzzlr.ash>;
import <excavator/projects/x_hookah.ash>;

void main( string event, string meta, string page )
{
    daily_spading_data();
    call_registered_projects( event, meta, page );
}
