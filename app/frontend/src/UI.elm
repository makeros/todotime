module UI exposing (..)

import Css exposing (..)
import Css.Global exposing (body, global)
import Html
import Html.Styled exposing (..)
import Html.Styled.Attributes exposing (class, value)
import Html.Styled.Events exposing (onClick, onInput)


theme : { secondary : Color, primary : Color }
theme =
    { primary = hex "010101"
    , secondary = hex "f1f1f1"
    }


btnSave : List (Attribute msg) -> List (Html msg) -> Html msg
btnSave =
    styled button
        [ className "uk-button uk-button-primary" ]


inputField : List (Attribute msg) -> List (Html msg) -> Html msg
inputField =
    styled input
        [ padding (px 8)
        , width (pct 100)
        ]
