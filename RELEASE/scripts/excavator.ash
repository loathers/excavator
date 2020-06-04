since r20145; // Support for spadingScripts with third param

import <excavator/utils.ash>;

// Projects
import <excavator/projects/guzzlr.ash>;
import <excavator/projects/hookah.ash>;

void main( string event, string meta, string page )
{
    call_registered_projects( event, meta, page );
}
