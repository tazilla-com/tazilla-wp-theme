<?php
/**
 * Retrieves the current year as a string.
 *
 * @return string The current year in 'YYYY' format.
 */
function tazilla_current_year(): string {
	return date('Y');
}
add_shortcode('year', 'tazilla_current_year');
