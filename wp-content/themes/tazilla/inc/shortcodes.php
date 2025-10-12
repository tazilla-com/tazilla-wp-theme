<?php
/**
 * Retrieves the current year as a string.
 *
 * @return string The current year in 'YYYY' format.
 *
 * @package Tazilla
 */
function tazilla_current_year(): string {
	return date( 'Y' );
}

add_shortcode( 'year', 'tazilla_current_year' );
