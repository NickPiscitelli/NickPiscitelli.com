use CGI;

    my $q = CGI->new;

my      $fh      = $q->param('test');

print $fh;
