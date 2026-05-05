// "use strict";
import { searchInput } from "../main.js";

const SEARCH_QUERY_HISTORY_DEBOUNCE_MS = 500;
const SEARCH_QUERY_HISTORY_MAX = 50;
const searchQueryHistory = [];
let searchQueryHistoryIndex = 0;
let searchQueryHistoryDraft = "";
let searchQueryHistoryEditingIndex = -1;
let pendingSearchQuery;
let searchQueryHistoryTimer;
let navigatingSearchQueryHistory = false;
let runSearchQuery = function () {};
let searchSpecialQueries = [];

export function configureSearchQueryHistory ( options ) {
  if ( typeof options.runQuery === "function" ) runSearchQuery = options.runQuery;
  if ( Array.isArray( options.specialQueries ) ) {
    searchSpecialQueries = options.specialQueries.map( query => query.toLowerCase() );
  }
}

export function clearSearchQueryHistoryTimer () {
  window.clearTimeout( searchQueryHistoryTimer );
}

export function clearPendingSearchQuery () {
  pendingSearchQuery = undefined;
}

function normalizeSearchQueryForHistory ( query ) {
  return query.trim();
}

function isSearchSpecialQuery ( query ) {
  return searchSpecialQueries.includes( query.toLowerCase() );
}

function shouldRememberSearchQuery ( query ) {
  return query.length >= 2 && !isSearchSpecialQuery( query );
}

function trimSearchQueryHistory () {
  while ( searchQueryHistory.length > SEARCH_QUERY_HISTORY_MAX ) {
    searchQueryHistory.shift();
  }
}

function rememberSearchQuery ( query ) {
  query = normalizeSearchQueryForHistory( query );

  if ( !shouldRememberSearchQuery( query ) ) {
    clearPendingSearchQuery();
    return;
  }

  if ( searchQueryHistory[ searchQueryHistory.length - 1 ] !== query ) {
    searchQueryHistory.push( query );
    trimSearchQueryHistory();
  }

  searchQueryHistoryIndex = searchQueryHistory.length;
  searchQueryHistoryDraft = "";
  clearPendingSearchQuery();
}

function commitPendingSearchQuery () {
  clearSearchQueryHistoryTimer();
  if ( pendingSearchQuery === undefined ) return;

  rememberSearchQuery( pendingSearchQuery );
}

export function debounceRememberSearchQuery ( query ) {
  if ( navigatingSearchQueryHistory ) return;

  pendingSearchQuery = query;
  searchQueryHistoryEditingIndex = -1;
  searchQueryHistoryIndex = searchQueryHistory.length;
  searchQueryHistoryDraft = "";
  clearSearchQueryHistoryTimer();
  searchQueryHistoryTimer = window.setTimeout( function () {
    rememberSearchQuery( pendingSearchQuery );
  }, SEARCH_QUERY_HISTORY_DEBOUNCE_MS );
}

function setSearchInputFromHistory ( query, historyIndex ) {
  if ( !( searchInput instanceof HTMLInputElement ) ) return;

  navigatingSearchQueryHistory = true;
  searchInput.value = query;
  runSearchQuery();
  navigatingSearchQueryHistory = false;
  searchQueryHistoryEditingIndex = historyIndex;
}

function removeCurrentSearchQueryHistoryItem () {
  if ( searchQueryHistoryEditingIndex === -1 ) return false;

  const removedIndex = searchQueryHistoryEditingIndex;
  searchQueryHistory.splice( removedIndex, 1 );
  searchQueryHistoryEditingIndex = -1;
  searchQueryHistoryIndex = Math.min( removedIndex, searchQueryHistory.length );

  if ( searchQueryHistoryIndex === searchQueryHistory.length ) {
    setSearchInputFromHistory( searchQueryHistoryDraft, -1 );
  }
  else {
    setSearchInputFromHistory( searchQueryHistory[ searchQueryHistoryIndex ], searchQueryHistoryIndex );
  }

  return true;
}

export function handleSearchQueryHistory ( event ) {
  if ( !( searchInput instanceof HTMLInputElement ) ) return;

  if ( event.key === "Delete" && ( event.ctrlKey || event.metaKey ) ) {
    commitPendingSearchQuery();
    if ( removeCurrentSearchQueryHistoryItem() ) event.preventDefault();
    return;
  }

  if ( event.key !== "ArrowUp" && event.key !== "ArrowDown" ) return;
  if ( searchQueryHistory.length === 0 ) return;

  event.preventDefault();
  commitPendingSearchQuery();

  if ( searchQueryHistoryIndex === searchQueryHistory.length ) {
    searchQueryHistoryDraft = searchInput.value;
  }

  if ( event.key === "ArrowUp" ) {
    if (
      searchQueryHistoryIndex === searchQueryHistory.length
      && normalizeSearchQueryForHistory( searchInput.value ) === searchQueryHistory[ searchQueryHistory.length - 1 ]
      && searchQueryHistory.length > 1
    ) {
      searchQueryHistoryIndex = searchQueryHistory.length - 2;
    }
    else {
      searchQueryHistoryIndex = Math.max( 0, searchQueryHistoryIndex - 1 );
    }
  }
  else {
    searchQueryHistoryIndex = Math.min( searchQueryHistory.length, searchQueryHistoryIndex + 1 );
  }

  if ( searchQueryHistoryIndex === searchQueryHistory.length ) {
    setSearchInputFromHistory( searchQueryHistoryDraft, -1 );
  }
  else {
    setSearchInputFromHistory( searchQueryHistory[ searchQueryHistoryIndex ], searchQueryHistoryIndex );
  }
}
