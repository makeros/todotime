module UI exposing (..)

--import Html

import Css exposing (..)
import Css.Global exposing (body, global)
import Html.Styled exposing (Attribute, Html, button, div, input, main_, styled)
import Html.Styled.Attributes exposing (class, value)
import Html.Styled.Events exposing (onClick, onInput)


theme : { secondary : Color, primary : Color }
theme =
    { primary = hex "010101"
    , secondary = hex "f1f1f1"
    }


inputField : List (Attribute msg) -> List (Html msg) -> Html msg
inputField =
    styled input
        [ padding (px 8)
        , width (pct 100)
        ]


containerMain : List (Attribute msg) -> List (Html msg) -> Html msg
containerMain =
    styled main_
        [ padding (px 16) ]


valueCircle : List (Attribute msg) -> List (Html msg) -> Html msg
valueCircle =
    styled div
        [ backgroundColor theme.primary
        , borderRadius (px 8)
        , textAlign center
        , padding2 (px 2) (px 8)
        , color (hex "ffffff")
        ]
