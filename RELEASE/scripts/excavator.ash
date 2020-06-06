since r20145; // Support for spadingScripts with third param

import <excavator/x_utils.ash>;

// Projects
import <excavator/projects/x_guzzlr.ash>;
import <excavator/projects/x_hookah.ash>;
import <excavator/projects/x_mumming_trunk.ash>;

void main( string event, string meta, string page )
{
    call_registered_projects( event, meta, page );
}
