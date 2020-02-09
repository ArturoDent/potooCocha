 <?php
//============================================================+
// File name   : makePDF.php
// 
// Last Update : 2016-7-6
//
// Description : Build a pdf checklist for potoococha.net/home.html
//               Uses SACC taxonomic data
//
// Author: Mark Mulhollam
//
// (c) Copyright:
//               Mark Mulhollam
//               potoococha.net
//============================================================+

// Include the main TCPDF library (search for installation path).
require_once('tcpdf/tcpdf.php');
require_once('tcpdf/config/tcpdf_config.php');
// set_time_limit(0);

// ---------------------------------------------------------

class PDF extends TCPDF {

	protected  $authors;
	protected  $country;

	protected  $numDays;
	protected  $dayWidthArray;
	protected  $headerCellWidth;
	protected  $headerWidth;

	protected  $rMargin;
	protected  $lMargin;

	protected  $contentWidth;
	protected  $contentHeight;	    

	protected  $endemics;
	protected  $lineNos;
	protected  $leftChecks;
	protected  $sciNames;
	protected  $italics;

	protected  $endemicCellWidth;
	protected  $familyCellWidth;
	protected  $familyCommonIndent;

	protected  $familySCiCellWidth;
	protected  $familyRowHeight;

	protected  $commonCellWidth;
	protected  $commonIndent;

	protected  $commonSciCellWidth;
	protected  $commonRowHeight;

	protected  $familyCellHeight;
	protected  $commonCellHeight;

	protected  $defaultSeparator;
	protected  $defaultSciSeparator;

	protected  $headerDefaultSeparator;
	protected  $finishedLastBird;

	function __construct($Dv, $Sd, $Ev, $Lv, $LCv, $Sv, $Si, $where) {

		$this->numDays     =  $Dv;
		$this->startDate   =  $Sd;
		$this->endemics    =  ($Ev  === 'true')  ? true : false;
		$this->lineNos     =  ($Lv  === 'true')  ? true : false;
		$this->leftChecks  =  ($LCv === 'true')  ? true : false;
		$this->sciNames    =  ($Sv  === 'true')  ? true : false;
		$this->italics     =  ($Si  === 'true')  ? true : false;
		$this->country     =  $where;

		$this->daysInMonth   =  array(31,29,31,30,31,30,31,31,30,31,30,31);  // 2020 is a leap year

		if ($this->endemics || $this->lineNos || $this->leftChecks)  {
			$this->endemicCellWidth = 13;
		}
		else $this->endemicCellWidth = 0;

		$this->dayWidthArray    =  array(0,32,31,30,29,28,26,24,22,20,18,16,14);
		$this->headerCellWidth  =  $this->dayWidthArray[$this->numDays];
		$this->headerWidth      =  $this->headerCellWidth * $this->numDays;
		
		$this->finishedLastBird = false;

	    // A4 is 210mm x 297mm or 595pt x 842pt

		$this->familyCommonIndent  =  6;
		$this->commonIndent        =  3;

		$this->familyRowHeight     =  13;
		$this->commonRowHeight     =  14;

		$this->defaultSeparator        =  array('B' => array('width' => 0.5),  'L' => array('width' => 0.5),'T' => array('width' => 0.5));
		$this->defaultNoSciSeparator   =  array('B' => array('width' => 0.5),  'L' => array('width' => 0.5),'T' => array('width' => 0.5),  'R' => array('width' => 0.5));

		$this->defaultSciSeparator     =  array('B' => array('width' => 0.5),  'T' => array('width' => 0.5),  'R' => array('width' => 0.5));
		$this->headerDefaultSeparator  =  array('B' => array('width' => 0.5),  'R' => array('width' => 0.5),   'L' => array('width' => 0.5),'T' => array('width' => 0.5));

    parent::__construct('P', 'pt', 'Letter'); 
   } 

	public function LoadData($file) {

	  $lines = file($file, FILE_IGNORE_NEW_LINES);
		return $lines;
	}

	public function LoadAuthors($file)  {

		$lines = file($file, FILE_IGNORE_NEW_LINES);
		$this->authors = str_replace("&nbsp;", " ", $lines[0]);
	}

	public function Header()  {
		
		// don't print a header if no more birds to print, only authors *****  just  return ?
		if ($this->finishedLastBird) return;

		// if ($this->PageNo() == 1)  {
		// 	$this->Cell('', '', $this->country . ' Checklist', 0, 0, 'L', 0);
		// }

		$this->SetFont('courier','',8);

		// inset from right margin by its own width
		$this->SetX(-($this->headerWidth + $this->rMargin));

		// SetX(further left if including month)  "June/July" if overlapping
		//    get length of month string

		// $i = startDate
		// ($i % (startDate + 6) == 0)

		for ( $i=1; $i <= $this->numDays; $i++ ) {
		// for ( $i=startDate; $i <= $this->numDays + startDate; $i++ ) {

			// put separator on right side of 5th cells unless it is the last
			//   OR *** 6 or 7 days chosen, then put end of third day

			// if ( ($i % (startDate + 6) == 0) && ($i != ($this->numDays + startDate) ) {
				
				// TODO : if days == 8  put double border after 4

			if ($this->numDays == 6 || $this->numDays == 7) {

				if ( ($i % 4 == 0) && ($i != $this->numDays) ) {
					$this->SetX($this->GetX() + 1);
					$this->Cell( $this->headerCellWidth, 12, $i, $this->headerDefaultSeparator, false, 'C', false );
				}
				else {
					$this->Cell( $this->headerCellWidth, 12, $i, $this->headerDefaultSeparator, false, 'C', false );
				}	  			
			}

			else {

				if ( ($i % 6 == 0) && ($i != $this->numDays) ) {
					$this->SetX($this->GetX() + 1);
					$this->Cell( $this->headerCellWidth, 12, $i, $this->headerDefaultSeparator, false, 'C', false );
				}
				elseif ( $i % 11 == 0 ) {
					$this->SetX($this->GetX() + 1);
					$this->Cell( $this->headerCellWidth, 12, $i, $this->headerDefaultSeparator, false, 'C', false );					
				}
				else {
					$this->Cell( $this->headerCellWidth, 12, $i, $this->headerDefaultSeparator, false, 'C', false );
				}
			}
		}
	}

	public function Footer()  {
		// Go to 0.5 in from bottom
		// $this->SetY(-36);
		$this->SetFontSize(8);

		if ($this->leftChecks)  {
			$this->Cell(25, $this->commonRowHeight, '', 1, 0, 'R', 0);
			$this->Cell(50, $this->commonRowHeight, ' :   Page Total', 0, 0, 'R', 0);
		}

		// Print centered page number
		// reset SetX if leftChecks to try centering the pageNo

		$this->Cell(0,10,'Page '. $this->PageNo(),0,0,'C');

		$this->SetFont('courier','',10);

		if      ($this->country == "FrenchGuiana")  $this->Cell('', '', 'French Guiana Checklist', 0, 0, 'R', 0);
		elseif  ($this->country == "SouthAmerica")  $this->Cell('', '',  'South America Checklist', 0, 0, 'R', 0);
		elseif  ($this->country == "Curacao")       $this->Cell('', '',  'Curaçao Checklist', 0, 0, 'R', 0);
		elseif  ($this->country == "Falklands")     $this->Cell('', '',  'Falklands / Malvinas Checklist', 0, 0, 'R', 0);
		else                                        $this->Cell('', '', $this->country . ' Checklist', 0, 0, 'R', 0);
	}

	public function MakeTable($allBirds) {

			// 	TINAMOUS,TINAMIDAE
			// 	,,Tawny-breasted Tinamou,Nothocercus julius
			// 	,,Highland Tinamou,N. bonapartei
			// 	,,Gray Tinamou,Tinamus tao
			// 	,endemic,Black Tinamou,T. osgoodi
			//	 5,,Great Tinamou,T. major

		$this->contentWidth     =  $this->GetPageWidth()  - ($this->lMargin + $this->rMargin + $this->endemicCellWidth);
	  $this->contentHeight    =  $this->GetPageHeight() - ($this->tMargin + $this->bMargin + $this->endemicCellWidth);

		if ($this->sciNames)  {

			$this->familyCellWidth     =  ($this->contentWidth - $this->headerWidth) / 2;
			$this->familySCiCellWidth  =   $this->contentWidth - $this->familyCellWidth;

			$this->commonCellWidth     =  ($this->contentWidth - $this->headerWidth) / 2;
			$this->commonSciCellWidth  =   $this->commonCellWidth;
		}
		else  {

			$this->familyCellWidth = $this->contentWidth;
			$this->commonCellWidth = $this->contentWidth - $this->headerWidth;
		}
				
		$this->familyCellHeight = $this->getCellHeight(11, true);
		$this->commonCellHeight = $this->getCellHeight(10, true);

		$AddLineNo = false;
		$dataLength = count($allBirds);

	  for ( $i=0; $i < $dataLength; $i++ ) {

			$bird = explode(',', $allBirds[$i]);

			//  *********************  Family  ********************
			
	  	if ( count($bird) == 2)  {

				// check for orphans/ widows (i.e., Families at bottom)

				if ($this->GetY() + $this->familyCellHeight + $this->commonCellHeight >= $this->PageBreakTrigger)  {
					$this->AddPage();
				}

				$this->SetCellPaddings($this->familyCommonIndent + $this->endemicCellWidth);
				$this->SetFont('courier', 'B', 10);
				$this->setFontSpacing  (1);

				$this->Cell( $this->familyCellWidth, $this->familyRowHeight, $bird[0], 0, 0, 'L', 0, '', 1);

				if ($this->sciNames)  {
					$this->SetCellPaddings($this->endemicCellWidth);  					
					$this->Cell( $this->familySCiCellWidth, $this->familyRowHeight, $bird[1], 0, 0, 'L', 0, '', 1 );
				}
				$this->Ln($this->familyRowHeight);
			}

			else {

					// 	TINAMOUS,TINAMIDAE
					// 	,,Tawny-breasted Tinamou,Nothocercus julius
					// 	,,Highland Tinamou,N. bonapartei
					// 	,,Gray Tinamou,Tinamus tao
					//	,endemic,Black Tinamou,T. osgoodi
					// 	5,,Great Tinamou,T. major
																			
				if (($i + 1) == $dataLength) $this->finishedLastBird = true;

				$this->setFontSpacing  (0);

				$AddLineNo = is_numeric($bird[0]);
				$AddEndemic = ($bird[1] == "endemic");
				$EndemicCellWritten = false;

    		if ($this->endemics || $this->lineNos || $this->leftChecks)  {

					if ($this->endemics && $AddEndemic) {

						$this->SetFont( '', '', 8 );

						if ($this->leftChecks)  {
							$this->Cell( $this->endemicCellWidth, $this->commonRowHeight, 'e', 1, 0, 'C', 0 );
						}
						else {
							$this->Cell( $this->endemicCellWidth, $this->commonRowHeight, 'e', 0, 0, 'C', 0 );
						}
						$EndemicCellWritten = true;
					}

					if ($this->lineNos && $AddLineNo  && !$EndemicCellWritten)  {

						$this->SetFont( '', '', 6 );

						if ($this->leftChecks)  {
								$this->Cell( $this->endemicCellWidth, $this->commonRowHeight, $bird[0], 1, 0, 'C', 0 );
						}
						else  {
							$this->Cell( $this->endemicCellWidth, $this->commonRowHeight, $bird[0], 0, 0, 'C', 0 );					
						}
						$EndemicCellWritten = true;
					}

					if ($this->leftChecks  && !$EndemicCellWritten)  {  					
						$this->Cell( $this->endemicCellWidth, $this->commonRowHeight, '', 1, 0, 'C', 0 );
						$EndemicCellWritten = true;
					}

					if (!$EndemicCellWritten) {
						$this->Cell( $this->endemicCellWidth, $this->commonRowHeight, '', 0, 0, 'C', 0 );					
					}
	  		}
  				
				$this->SetCellPaddings($this->commonIndent,0,10,0);
				$this->SetFont('', '', 10);


				if ($this->sciNames) {
					$this->setFontSpacing  (0);

					// last parameter : 1 forces font squeezing if text overflows cell width
					$this->Cell( $this->commonCellWidth, $this->commonRowHeight, $bird[2], $this->defaultSeparator, 0, 'L', 0,'', 1 );
				}
				else {
					$this->setFontSpacing  (1);
					$this->SetCellPaddings($this->commonIndent + 6,0,10,0);

					$this->Cell( $this->commonCellWidth, $this->commonRowHeight, $bird[2], $this->defaultNoSciSeparator, 0, 'L', 0,'' );
				}

  			if ($this->sciNames) {

					$this->SetCellPaddings(0);

					if ($this->italics) {
						$this->SetFont('', 'I', 10);
					}
					else {
						$this->SetFont('', '', 10);
					}

					// last parameter : 1 forces font squeezing if text overflows cell width
  				$this->Cell( $this->commonSciCellWidth, $this->commonRowHeight, $bird[3], $this->defaultSciSeparator, 0, 'L', 0, '', 1 );
  			}
	   
	   		$this->SetFont('','',8);
				$this->SetCellPaddings(0);
				$this->setFontSpacing  (0);

  			for ( $j=1; $j <= $this->numDays; $j++ ) {

			  	if ($this->numDays == 6 || $this->numDays == 7) {

						if ( $j % 4 == 0 ) {

		    				$this->SetX($this->GetX() + 1);
						}
					}

					else {

	  				// if ( $AddLineNo  && ($j % 6 == 0) && ($j != $this->numDays) ) {
		    		// 		$this->SetX($this->GetX() + 1);
	  				// }

						if ( ($j % 6 == 0) && ($j != $this->numDays) ) {
							$this->SetX($this->GetX() + 1);
						}
						elseif ( $j % 11 == 0 ) {
							$this->SetX($this->GetX() + 1);
						}
					}

  				$this->Cell( $this->headerCellWidth, $this->commonRowHeight, '', $this->headerDefaultSeparator, 0, 'C', 0 );
				}

				if ($AddLineNo) {
  				$this->Ln($this->commonRowHeight + 1);
				}
				else {
  				$this->Ln($this->commonRowHeight);
  			}
  		}
		}
		
		// print checklist authors here, this will be the last page
		if ($this->authors)  {
	  		$this->Ln(40);
		   	$this->SetFont('','',11);
		    $this->SetX($this->GetX() + 30);

				$this->MultiCell  ( 450, 20, $this->authors, 0, 'L', false );
		}
	}	
}

error_reporting(0);

$country     =  filter_var($_GET['country'],  FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
$num_days    =  filter_var($_GET['num_days'],  FILTER_SANITIZE_NUMBER_INT);
$start_date  =  filter_var($_GET['start_date'],  FILTER_SANITIZE_NUMBER_INT);

$line_nos    =  filter_var($_GET['line_nos'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
$left_check  =  filter_var($_GET['left_check'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
$endemics    =  filter_var($_GET['endemics'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);
$sci_names   =  filter_var($_GET['sci_names'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);

$italics     =  filter_var($_GET['italics'], FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_HIGH | FILTER_FLAG_STRIP_LOW);

$pdf = new PDF( $num_days, $start_date, $endemics, $line_nos, $left_check, $sci_names, $italics, $country);

$pdf->setFontSubsetting(false);

$pdf->SetCreator('potoococha.net');
$pdf->SetAuthor('SACC');
$pdf->SetTitle($country . ' Checklist SACC');
$pdf->SetSubject($country);
$pdf->SetKeywords('SACC, ' . $country . ', Checklist');

// set default monospaced font
// $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
// $pdf->SetMargins(36,36,36);

// $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->setHeaderMargin(24);
$pdf->setFooterMargin(36);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, 36);

// ---------------------------------------------------------

$birds = $pdf->LoadData('../Countries/' . $country . 'PDF.txt');

$pdf->LoadAuthors('../Authors/' . $country . '.txt');

$pdf->SetMargins(36,36,36);

$pdf->AddPage();
  					
$pdf->MakeTable($birds);

// must flush [error] output before creating the pdf
ob_clean();

$pdf->Output($country . '-SACC-Checklist.pdf', 'I');
?>