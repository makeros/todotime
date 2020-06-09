port module Main exposing (..)

import Array
import Css exposing (..)
import Css.Global exposing (body, global, html)
import Html exposing (..)
import Html.Attributes exposing (attribute, class, classList, disabled, for, id, type_, value)
import Html.Events exposing (..)
import Html.Styled exposing (toUnstyled)
import Json.Decode as JD
import Json.Encode as JE
import Task



-- import UI
-- TODO: create just one port for IN and one port for OUT


port userSettingsSave : PreferencesModel -> Cmd msg


port checkTodoistPremiumCallback : (Bool -> msg) -> Sub msg


port checkTodoistPremium : String -> Cmd msg


port closeWindow : () -> Cmd msg


main : Program (Maybe PreferencesModel) Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- View


view : Model -> Browser.Document Msg
view model =
    { title = "Todotime • Preferences"
    , body =
        [ toUnstyled
            (global
                [ body
                    [ margin (px 0)
                    , backgroundColor (hex "f9f9f9")
                    ]
                , html [ height (pct 100) ]
                ]
            )
        , viewBody model
        ]
    }
